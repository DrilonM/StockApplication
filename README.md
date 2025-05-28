# Macedonian Stock Exchange Data and Analysis App
## The project is deployed on Azure. Access it live here:  
[StockPulsar Live Deployment](https://stockpulsar-deploy-finki-feg8a7c8aaf2h6ef.westeurope-01.azurewebsites.net/)
---
This project provides a comprehensive stock data analysis platform that retrieves data from the Macedonian Stock Exchange (MSE) and performs various analyses. It features:


- **Technical Analysis**
- **Fundamental Analysis**
- **LSTM Stock Price Prediction**

The project is built with:
- **Python** for data scraping, analysis, and machine learning.
- **Java Spring Boot** for backend API development.
- **React** for the frontend user interface.

# Features

1. **Daily Stock Data Update**
    - Python script scrapes stock data from MSE daily and saves it to an SQLite database.
    - Data includes real-time market prices and other relevant metrics.

2. **Analysis Types**
    - **Technical Analysis**: Identify trends and indicators.
    - **Fundamental Analysis**: Evaluate stock value based on news sentiment analysis, financial statements and ratios.
    - **LSTM Stock Price Prediction**: Predict future stock prices using machine learning.

3. **SQLite Database**
    - Shared database for Python and Java to store stock data and analysis results.

4. **Backend (Java Spring Boot)**
    - RESTful APIs for retrieving stock data and analysis results.
    - Serves as a bridge between the database and the frontend.

5. **Frontend (React)**
    - User-friendly interface for visualizing stock data and analyses.
    - Makes API requests to the Java backend.

# Design Patterns

Refer to the attached **Design Patterns.pdf** file.
