import sqlite3
import requests
from bs4 import BeautifulSoup

links = []
issuers = {}

DB_PATH = "../../database/stock_data.db"

def initialize_table():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''
            CREATE TABLE IF NOT EXISTS issuer_links (
                issuer TEXT PRIMARY KEY,
                link TEXT
            )
        ''')
    conn.commit()
    return conn


def get_links_from_table(soup, table_id):
    table = soup.find('table', {'id': table_id})
    if table:
        for row in table.find_all('tr'):
            link = row.find('a', href=True)
            if link:
                links.append(link['href'])


def fetch_tables():
    tables = ['super-table', 'exchange-table', 'mandatory-table']

    url = 'https://www.mse.mk/en/issuers/shares-listing'

    response = requests.get(url)

    soup = BeautifulSoup(response.content, 'html.parser')

    for table_id in tables:
        get_links_from_table(soup, table_id)

def combine_with_symbols(issuer_links):
    for link in issuer_links:
        url = 'https://www.mse.mk' + link
        response = requests.get(url)

        soup = BeautifulSoup(response.content, 'html.parser')

        symbol = soup.find_all('a', {'class': 'nav-link active', 'data-toggle': 'tab'})

        issuers[symbol[1].text] = url

def insert_to_db(conn):
    for issuer, link in issuers.items():
        conn.execute('''
                    INSERT OR REPLACE INTO issuer_links (issuer, link)
                    VALUES (?, ?)
                ''', (issuer, link))
    conn.commit()
    conn.close()

def main():
    conn = initialize_table()
    fetch_tables()
    combine_with_symbols(links)
    insert_to_db(conn)
    print("Done.")
main()