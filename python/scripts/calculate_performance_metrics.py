import pandas as pd
import requests
from bs4 import BeautifulSoup
import sqlite3

DB_PATH = "../../database/stock_data.db"

def initialize_table(conn):
    conn.execute('''
                CREATE TABLE IF NOT EXISTS performance_metrics (
                    issuer TEXT PRIMARY KEY, 
                    link TEXT, 
                    growth23v22 REAL, 
                    growth22v21 REAL, 
                    operating_margin23 REAL, 
                    operating_margin22 REAL, 
                    net_margin23 REAL, 
                    net_margin22 REAL, 
                    roe23 REAL, 
                    roe22 REAL, 
                    debt_equity23 REAL, 
                    debt_equity22 REAL, 
                    pe_ratio23 REAL,
                    performance TEXT
                )
            ''')
    conn.commit()
    return conn

def fetch_financial_data(link):
    response = requests.get(link)

    soup = BeautifulSoup(response.content, 'html.parser')

    table = soup.find('table', class_='table table-bordered table-condensed table-striped')

    rows = table.find_all('tr')

    data = {}

    for row in rows[1:]:
        cells = row.find_all('td')

        if len(cells) == 4:
            metric = cells[0].get_text(strip=True)
            year_2023 = int(cells[1].get_text(strip=True).replace(',', '') or 0)
            year_2022 = int(cells[2].get_text(strip=True).replace(',', '') or 0)
            year_2021 = int(cells[3].get_text(strip=True).replace(',', '') or 0)

            data[metric] = {
                '2023': year_2023,
                '2022': year_2022,
                '2021': year_2021
            }

    return data

def calculate_growth(current_value, previous_value):
    if previous_value == 0:
        return 0
    return ((current_value - previous_value) / previous_value) * 100

def calculate_performance_metrics(data):
    growth23v22 = calculate_growth(data["Total Revenue from operation Activities"]["2023"], data["Total Revenue from operation Activities"]["2022"])
    growth22v21 = calculate_growth(data["Total Revenue from operation Activities"]["2022"], data["Total Revenue from operation Activities"]["2021"])

    if data['Total Revenue from operation Activities']["2023"] != 0 and data['Total Revenue from operation Activities']["2022"] != 0:
        operating_margin23 = (data["Operating profit"]["2023"] / data["Total Revenue from operation Activities"]["2023"]) * 100
        operating_margin22 = (data["Operating profit"]["2022"] / data["Total Revenue from operation Activities"]["2022"]) * 100
        net_margin23 = (data["Net profit"]["2023"] / data["Total Revenue from operation Activities"]["2023"]) * 100
        net_margin22 = (data["Net profit"]["2022"] / data["Total Revenue from operation Activities"]["2022"]) * 100
    else:
        operating_margin23 = 0
        operating_margin22 = 0
        net_margin23 = 0
        net_margin22 = 0

    roe23 = (data["Net profit"]["2023"] / data["Equity"]["2023"]) * 100
    roe22 = (data["Net profit"]["2022"] / data["Equity"]["2022"]) * 100

    debt_equity23 = data["Total liabilities"]["2023"] / data["Equity"]["2023"]
    debt_equity22 = data["Total liabilities"]["2022"] / data["Equity"]["2022"]

    if data["Net profit"]["2023"] != 0:
        pe_ratio23 = data["Market capitalization"]["2023"] / data["Net profit"]["2023"]
    else:
        pe_ratio23 = 0

    metrics = {
        "growth23v22": growth23v22,
        "growth22v21": growth22v21,
        "operating_margin23": operating_margin23,
        "operating_margin22": operating_margin22,
        "net_margin23": net_margin23,
        "net_margin22": net_margin22,
        "roe23": roe23,
        "roe22": roe22,
        "debt_equity23": debt_equity23,
        "debt_equity22": debt_equity22,
        "pe_ratio23": pe_ratio23,
    }

    return metrics


def analyze_performance(data):
    performance_thresholds = {
        "revenue": [(10, "Good")],
        "operating_margin": [(12, "Good"), (8, "Neutral")],
        "net_margin": [(10, "Good"), (5, "Neutral")],
        "roe": [(15, "Good"), (10, "Neutral")],
        "debt_equity": [(0, "Good"), (0.5, "Neutral"), (1, "Poor")],
        "pe_ratio": [(20, "Good"), (15, "Neutral")],
    }

    performance = {}

    def assign_performance(metric, value):
        if value == 0:
            return "Poor"
        for threshold, rating in performance_thresholds[metric]:
            if value >= threshold:
                return rating
        return "Poor"

    performance['revenue_23v22'] = assign_performance("revenue", data["growth23v22"])
    performance['revenue_22v21'] = assign_performance("revenue", data["growth22v21"])
    performance['operating_margin_23'] = assign_performance("operating_margin", data["operating_margin23"])
    performance['operating_margin_22'] = assign_performance("operating_margin", data["operating_margin22"])
    performance['net_margin_23'] = assign_performance("net_margin", data["net_margin23"])
    performance['net_margin_22'] = assign_performance("net_margin", data["net_margin22"])
    performance['roe_23'] = assign_performance("roe", data["roe23"])
    performance['roe_22'] = assign_performance("roe", data["roe22"])
    performance['debt_equity_23'] = assign_performance("debt_equity", data["debt_equity23"])
    performance['debt_equity_22'] = assign_performance("debt_equity", data["debt_equity22"])
    performance['pe_ratio_23'] = assign_performance("pe_ratio", data["pe_ratio23"])

    good_count = sum(1 for p in performance.values() if p == "Good")
    neutral_count = sum(1 for p in performance.values() if p == "Neutral")
    poor_count = sum(1 for p in performance.values() if p == "Poor")

    if good_count >= 6:
        return "Excellent"
    elif good_count >= 4:
        return "Good"
    elif poor_count <= 3 and good_count >= 2:
        return "Neutral"
    else:
        return "Poor"

def main():
    conn = sqlite3.connect(DB_PATH)
    conn = initialize_table(conn)

    issuers = pd.read_sql_query("SELECT * FROM issuer_links", conn)['issuer'].tolist()
    links = pd.read_sql_query("SELECT * FROM issuer_links", conn)['link'].tolist()

    for issuer, link in zip(issuers, links):
        data = fetch_financial_data(link)
        metrics = calculate_performance_metrics(data)
        overall_performance = analyze_performance(metrics)
        conn.execute('''
                    INSERT OR REPLACE INTO performance_metrics (
                        issuer, link, growth23v22, growth22v21, operating_margin23, operating_margin22,
                        net_margin23, net_margin22, roe23, roe22, debt_equity23, debt_equity22, pe_ratio23, performance
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
            issuer, link, metrics["growth23v22"], metrics["growth22v21"], metrics["operating_margin23"],
            metrics["operating_margin22"], metrics["net_margin23"], metrics["net_margin22"], metrics["roe23"],
            metrics["roe22"], metrics["debt_equity23"], metrics["debt_equity22"], metrics["pe_ratio23"],
            overall_performance
        ))

    conn.commit()
    conn.close()

    print('Done.')

main()


