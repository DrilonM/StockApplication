@echo off

start cmd /k "cd /d %cd%\python\scripts && python fetch_issuer_links.py"
start cmd /k "cd /d %cd%\python\scripts && python scraper.py"
start cmd /k "cd /d %cd%\python\scripts && python metrics_computer.py"
start cmd /k "cd /d %cd%\python\scripts && python news_sentiments.py"
start cmd /k "cd /d %cd%\python\scripts && python calculate_performance_metrics.py"
start cmd /k "cd /d %cd%\python\scripts && python PricePredictor.py"

start /wait cmd /k "cd /d %cd%\services\data-access-api && java -jar .\target\backend-0.0.1-SNAPSHOT.jar"

start cmd /k "cd /d %cd%\services\metrics-access-api && java -jar .\target\backend-0.0.1-SNAPSHOT.jar"

start cmd /k "cd /d %cd%\services\prediction-access-api && java -jar .\target\backend-0.0.1-SNAPSHOT.jar"

start cmd /k "cd /d %cd%\services\sentimets-access-api && java -jar .\target\backend-0.0.1-SNAPSHOT.jar"

start cmd /k "cd /d %cd%\frontend && npm start"
