import sqlite3
import torch
import torch.nn as nn
import numpy as np
from matplotlib import pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

def load_issuer_data(conn, issuer):
    query = f"""
    SELECT issuer, date, last_trade_price, percent_change, volume FROM stock_data WHERE issuer = ? ORDER BY date
    """
    df = pd.read_sql(query, conn, params=(issuer,))
    return df

def create_dataset(data, time_step):
    X, y = [], []
    for i in range(len(data) - time_step):
        X.append(data[i:(i + time_step), :])
        y.append(data[i + time_step, 1])
    return np.array(X), np.array(y)

class StockPriceLSTM(nn.Module):
    def __init__(self, input_size, hidden_layer_size=20, output_size=1, num_layers=2, dropout_rate=0.2):
        super(StockPriceLSTM, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_layer_size, num_layers=num_layers, dropout=dropout_rate, batch_first=True)
        self.fc = nn.Linear(hidden_layer_size, output_size)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        predictions = self.fc(lstm_out[:, -1])
        return predictions

def train_model_with_early_stopping(model, optimizer, criterion, scheduler, X_train, y_train, X_val, y_val, max_epochs=100, patience=10):
    best_model_state = None
    best_val_loss = float('inf')
    epochs_no_improve = 0

    for epoch in range(max_epochs):
        model.train()
        optimizer.zero_grad()
        outputs = model(X_train)
        loss = criterion(outputs, y_train.view(-1, 1))
        loss.backward()
        optimizer.step()
        scheduler.step(loss)

        model.eval()
        with torch.no_grad():
            val_outputs = model(X_val)
            val_loss = criterion(val_outputs, y_val.view(-1, 1)).item()

        print(f"Epoch {epoch + 1}/{max_epochs}, Train Loss: {loss.item()}, Validation Loss: {val_loss}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            best_model_state = model.state_dict()
            epochs_no_improve = 0
        else:
            epochs_no_improve += 1

        if epochs_no_improve >= patience:
            print("Early stopping triggered")
            break

    model.load_state_dict(best_model_state)
    return model

DB_PATH = "../../../database/stock_data.db"

def doPrediction(conn, issuer):
    print(issuer)
    df = load_issuer_data(conn, issuer)

    if df.empty:
        print(f"No data found for issuer {issuer}.")
        return

    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')

    feature_columns = ['last_trade_price', 'percent_change', 'volume']
    data = df[feature_columns]

    scaler = StandardScaler()
    standardized_data = scaler.fit_transform(data)

    time_steps = 60
    X, y = create_dataset(standardized_data, time_steps)

    if len(X) == 0:
        print(f"Insufficient data to create dataset for issuer {issuer}.")
        return

    features = X.shape[2]
    X = X.reshape(X.shape[0], time_steps, features)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, shuffle=False)
    X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.2, shuffle=False)

    model = StockPriceLSTM(input_size=features, hidden_layer_size=50, num_layers=3)

    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=5)

    X_train = torch.tensor(X_train, dtype=torch.float32)
    y_train = torch.tensor(y_train, dtype=torch.float32)
    X_val = torch.tensor(X_val, dtype=torch.float32)
    y_val = torch.tensor(y_val, dtype=torch.float32)
    X_test = torch.tensor(X_test, dtype=torch.float32)
    y_test = torch.tensor(y_test, dtype=torch.float32)

    model = train_model_with_early_stopping(model, optimizer, criterion, scheduler, X_train, y_train, X_val, y_val)

    model.eval()
    with torch.no_grad():
        predictions = model(X_test).numpy()

    predictions_reshaped = np.zeros((predictions.shape[0], 3))
    predictions_reshaped[:, 1] = predictions[:, 0]
    predictions_rescaled = scaler.inverse_transform(predictions_reshaped)[:, 1]

    y_test_reshaped = np.zeros((y_test.shape[0], 3))
    y_test_reshaped[:, 1] = y_test.numpy()

    actual_returns_rescaled = scaler.inverse_transform(y_test_reshaped)[:, 1]

    predicted_prices = df['last_trade_price'].iloc[-len(y_test):].values * (1 + predictions_rescaled / 100)
    actual_prices = df['last_trade_price'].iloc[-len(y_test):].values * (1 + actual_returns_rescaled / 100)

    future_predictions = []
    last_data = standardized_data[-time_steps:].reshape(1, time_steps, features)

    today = pd.Timestamp.today()
    future_dates = pd.date_range(df['date'].iloc[-1], today + pd.Timedelta(days=30), freq='B')[1:]

    future_dates = future_dates.unique()

    for _ in range(len(future_dates)):
        with torch.no_grad():
            future_pred = model(torch.tensor(last_data, dtype=torch.float32)).numpy()

        next_percent_change = future_pred[0, 0]
        future_predictions.append(next_percent_change)

        last_data = np.roll(last_data, -1, axis=1)
        last_data[0, -1, 1] = next_percent_change

    future_prices = []
    last_future_price = predicted_prices[-1]
    for percent_change in future_predictions:
        last_future_price *= (1 + percent_change / 100)
        future_prices.append(last_future_price)

    conn.execute(""" 
            CREATE TABLE IF NOT EXISTS next_month_predictions (
                issuer TEXT,
                date DATE,
                predicted_price REAL,
                PRIMARY KEY (issuer, date)
            )
        """)
    conn.execute(""" 
            CREATE TABLE IF NOT EXISTS evaluation_metrics (
                issuer TEXT PRIMARY KEY,
                r2 REAL,
                mae REAL,
                rmse REAL,
                last_trade_price REAL
            )
        """)
    conn.commit()

    print(future_dates)

    prediction_data = [(issuer, date.strftime('%Y-%m-%d'), price) for date, price in zip(future_dates, future_prices)]



    mse = mean_squared_error(actual_prices, predicted_prices)
    r2 = r2_score(actual_prices, predicted_prices)
    rmse = np.sqrt(mse)
    last_trade_price = df['last_trade_price'].iloc[-1]

    if r2 <= 0:
        return

    conn.executemany(""" 
            INSERT OR REPLACE INTO next_month_predictions (issuer, date, predicted_price) VALUES (?, ?, ?)
        """, prediction_data)
    evaluation_data = (issuer, r2, mse, rmse, last_trade_price)
    conn.execute(""" 
            INSERT OR REPLACE INTO evaluation_metrics (issuer, r2, mae, rmse, last_trade_price) VALUES (?, ?, ?, ?, ?)
        """, evaluation_data)
    conn.commit()

    print(f"Mean Squared Error: {mse}")
    print(f"R2 Score: {r2}")


def main():
    conn = sqlite3.connect(DB_PATH)

    issuers = pd.read_sql_query("SELECT * FROM issuer_links", conn)['issuer'].tolist()

    for issuer in issuers:
        doPrediction(conn, issuer)
    conn.close()

main()
