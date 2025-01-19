import asyncio
import random
import time
import aiohttp
import pandas as pd
import sqlite3
import datetime
from io import StringIO
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import os

BASE_URL_DATA = "https://www.mse.mk/en/stats/symbolhistory"
BASE_URL_ISSUERS = "https://www.mse.mk/en/stats/current-schedule"

ua = UserAgent()
HEADERS = {'User-Agent': ua.random}

semaphore1 = asyncio.Semaphore(10)
semaphore2 = asyncio.Semaphore(20)

def initialize_database():
    db_folder = os.path.join(os.path.dirname(__file__), "..", "..", "database")
    os.makedirs(db_folder, exist_ok=True)
    db_path = os.path.join(db_folder, "stock_data.db")

    conn = sqlite3.connect(db_path)
    conn.execute('''
            CREATE TABLE IF NOT EXISTS stock_data (
                issuer TEXT,
                date TEXT,
                last_trade_price REAL,
                max REAL,
                min REAL,
                avg_price REAL,
                percent_change REAL,
                volume REAL,
                turnover_best REAL,
                total_turnover REAL,
                PRIMARY KEY (issuer, date)
            )
        ''')
    conn.commit()
    conn.close()

def get_db_path():
    db_folder = os.path.join(os.path.dirname(__file__), "..", "..", "database")
    return os.path.join(db_folder, "stock_data.db")

#Filter 1
async def get_issuer_codes(conn):
    cursor = conn.cursor()

    cursor.execute("SELECT issuer FROM issuer_links")
    issuer_codes = [row[0] for row in cursor.fetchall()]

    return issuer_codes


#Filter 2
def get_last_available_date(conn, issuer):
    cur = conn.cursor()
    cur.execute("SELECT MAX(date) FROM stock_data WHERE issuer = ?", (issuer,))
    result = cur.fetchone()[0]
    if result:
        return (datetime.datetime.strptime(result, "%Y-%m-%d") + datetime.timedelta(days=1)).strftime("%m/%d/%Y")
    else:
        return (datetime.datetime.now() - datetime.timedelta(days=3650)).strftime("%m/%d/%Y")

#Filter 3
async def fetch_issuer_data(session, issuer, start_date, end_date):
    async with semaphore2:
        url = f"{BASE_URL_DATA}/{issuer}?FromDate={format_date_MSE(start_date)}&ToDate={format_date_MSE(end_date)}"

        response_text = await fetch(session, url)
        try:
            tables = pd.read_html(StringIO(response_text), flavor="lxml")
            df = tables[0]
            df['issuer'] = issuer
            df.columns = [
                'date', 'last_trade_price', 'max', 'min', 'avg_price',
                'percent_change', 'volume', 'turnover_best', 'total_turnover', 'issuer'
            ]

            df = df.dropna(subset=['max', 'min'])

            if not df.empty:
                df.loc[:, 'date'] = pd.to_datetime(df['date'], format='%m/%d/%Y').dt.strftime('%Y-%m-%d')

            return df
        except ValueError:
            return pd.DataFrame()


async def process_issuer(session, issuer, last_date):
    async with semaphore1:
        current_date = datetime.datetime.strptime(last_date, "%m/%d/%Y")
        end_date = datetime.datetime.now()

        tasks = []
        while current_date <= end_date:
            next_date = min(current_date + datetime.timedelta(days=365), end_date)
            tasks.append(asyncio.create_task(fetch_issuer_data(session, issuer, current_date, next_date)))
            current_date = next_date + datetime.timedelta(days=1)

        data_frames = await asyncio.gather(*tasks)

        # print(f"{issuer} finished")
        return pd.concat(data_frames, ignore_index=True) if data_frames else pd.DataFrame()


def get_last_available_dates(conn, issuers):
    last_dates = {}
    for issuer in issuers:
        last_date = get_last_available_date(conn, issuer)
        last_dates[issuer] = last_date
    return last_dates

async def main():
    start_time = time.time()

    initialize_database()

    async with aiohttp.ClientSession() as session:
        conn = sqlite3.connect(get_db_path())
        issuer_codes = await get_issuer_codes(conn)
        last_dates = get_last_available_dates(conn, issuer_codes)
        conn.close()

        tasks = [
            process_issuer(session, issuer, last_dates[issuer])
            for issuer in issuer_codes
        ]
        results = await asyncio.gather(*tasks)

        combined_data = pd.concat(results, ignore_index=True)
        if not combined_data.empty:
            conn = sqlite3.connect(get_db_path())
            combined_data.to_sql("stock_data", conn, if_exists="append", index=False)
            conn.close()

    end_time = time.time()
    print(f"Data population completed in {end_time - start_time:.2f} seconds.")

def format_date_MSE(date):
    return date.strftime("%m/%d/%Y")

def format_date_display(date):
    return date.strftime("%d.%m.%Y")

def switch_delimiters(value):
    if pd.isna(value):
        return value
    value = str(value).replace(',', '_').replace('.', ',').replace('_', '.')
    return value


def convert_data_for_display(df):
    df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d').apply(format_date_display)

    columns_to_edit = ['last_trade_price', 'max', 'min', 'avg_price', 'volume', 'turnover_best',
                       'total_turnover']

    for column in columns_to_edit:
        df[column] = df[column].apply(lambda x: "{:,.2f}".format(float(x)) if pd.notna(x) else x)
        df[column] = df[column].apply(switch_delimiters)

# async def fetch(session, url):
#     async with session.get(url, headers=HEADERS) as response:
#         return await response.text()

async def fetch(session, url, retries=5, backoff_factor=0.5, timeout=20):
    attempt = 0

    while attempt < retries:
        try:
            async with session.get(url, timeout=timeout, headers=HEADERS, ssl=False) as response:

                if response.status == 200:
                    return await response.text()
                else:
                    print(response.status)
                    raise aiohttp.ClientResponseError(
                        status=response.status,
                        message=f"Received status {response.status} from server",
                        request_info=f"Request to {url} failed",
                        history=()
                    )
        except (aiohttp.ClientError, asyncio.TimeoutError) as e:
            attempt += 1
            if attempt >= retries:
                time.sleep(2)
                raise


            delay = backoff_factor * (2 ** attempt)  + random.uniform(0.001, 0.01)
            await asyncio.sleep(delay)

if __name__ == "__main__":
    asyncio.run(main())