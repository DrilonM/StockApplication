import sqlite3
import pandas as pd
import numpy as np
from ta import momentum, trend

DB_PATH = "../../database/stock_data.db"

def initialize_table():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS precomputed_metrics (
            issuer TEXT,
            period TEXT,
            start_date TEXT,
            end_date TEXT,
            rsi REAL,
            macd REAL,
            stoch REAL,
            ao REAL,
            williams REAL,
            cci REAL,
            sma REAL,
            ema REAL,
            wma REAL,
            hma REAL,
            ibl REAL,
            PRIMARY KEY (issuer, period, start_date, end_date)
        )
    ''')
    conn.commit()
    conn.close()

def calculate_metrics(df, period):
    metrics = {}

    if period == '1d':
        window = 14
        window_slow=12
        window_fast=26
        awesome_slow=5
        awesome_fast=34
        sma_window=10
        ema_window=12
        wma_window=10
        hma_window=14
        ibl_window=9
    elif period == '1w':
        window = 5 * 5
        window_slow = 12 * 5
        window_fast = 26 * 5
        awesome_slow = 5 * 5
        awesome_fast = 34 * 5
        sma_window = 10 * 5
        ema_window = 12 * 5
        wma_window = 20
        hma_window = 20
        ibl_window = 26
    elif period == '1m':
        window = 3 * 21
        window_slow = 12 * 21
        window_fast = 26 * 21
        awesome_slow = 5 * 21
        awesome_fast = 34 * 21
        sma_window = 50
        ema_window = 50
        wma_window= 50
        hma_window = 50
        ibl_window = 26

    rsi = momentum.RSIIndicator(close=df['last_trade_price'], window=window)
    metrics['rsi'] = rsi.rsi().iloc[-1]

    macd = trend.MACD(close=df['last_trade_price'], window_slow=window_slow, window_fast=window_fast)
    metrics['macd'] = macd.macd().iloc[-1]

    stoch = momentum.StochasticOscillator(
        high=df['max'],
        low=df['min'],
        close=df['last_trade_price'],
        window=window,
        smooth_window=3
    )
    metrics['stoch'] = stoch.stoch().iloc[-1]

    df['midpoint'] = (df['max'] + df['min']) / 2
    short_sma = df['midpoint'].rolling(window=awesome_slow).mean()
    long_sma = df['midpoint'].rolling(window=awesome_fast).mean()
    metrics['ao'] = (short_sma - long_sma).iloc[-1]

    williams = momentum.WilliamsRIndicator(high=df['max'], low=df['min'], close=df['last_trade_price'])
    metrics['williams'] = williams.williams_r().iloc[-1]

    cci = trend.CCIIndicator(high=df['max'], low=df['min'], close=df['last_trade_price'], window=window)
    metrics['cci'] = cci.cci().iloc[-1]

    metrics['sma'] = df['last_trade_price'].rolling(window=sma_window).mean().iloc[-1]
    metrics['ema'] = df['last_trade_price'].ewm(span=ema_window, adjust=False).mean().iloc[-1]
    metrics['wma'] = df['last_trade_price'].rolling(window=wma_window).apply(lambda x: np.average(x, weights=np.arange(1, wma_window + 1))).iloc[-1]
    metrics['hma'] = df['last_trade_price'].rolling(window=hma_window).apply(lambda x: np.sqrt(np.average(x ** 2))).iloc[-1]

    high = df['max'].rolling(window=ibl_window).max()
    low = df['min'].rolling(window=ibl_window).min()
    ibl = (high + low) / 2
    metrics['ibl'] = ibl.iloc[-1]

    return metrics

def precompute_metrics(conn, issuer, period):
    query = f"SELECT * FROM stock_data WHERE issuer = '{issuer}' ORDER BY date"
    df = pd.read_sql_query(query, conn)
    df['date'] = pd.to_datetime(df['date'])

    if df.empty:
        return
    if period == '1d':
        data = df.tail(34).copy()
    elif period == '1w':
        data = df.tail(34 * 5).copy()
    elif period == '1m':
        data = df.tail(34 * 21).copy()
    else:
        return

    metrics = calculate_metrics(data, period)
    start_date = data['date'].min().strftime('%Y-%m-%d')
    end_date = data['date'].max().strftime('%Y-%m-%d')

    conn.execute('''  
        INSERT OR REPLACE INTO precomputed_metrics (
            issuer, period, start_date, end_date,
            rsi, macd, stoch, ao, williams, cci,
            sma, ema, wma, hma, ibl
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        issuer, period, start_date, end_date,
        metrics['rsi'], metrics['macd'], metrics['stoch'], metrics['ao'], metrics['williams'], metrics['cci'],
        metrics['sma'], metrics['ema'], metrics['wma'], metrics['hma'], metrics['ibl']
    ))
    conn.commit()

def main():
    initialize_table()

    conn = sqlite3.connect(DB_PATH)

    issuers = pd.read_sql_query("SELECT DISTINCT issuer FROM stock_data", conn)['issuer'].tolist()

    periods = ['1d', '1w', '1m']

    for issuer in issuers:
        for period in periods:
            precompute_metrics(conn, issuer, period)

    conn.close()

if __name__ == "__main__":
    main()
