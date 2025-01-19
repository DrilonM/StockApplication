FROM python:3.11-slim

WORKDIR /usr/src/app

COPY . .

# RUN pip install --no-cache-dir -r requirements.txt

CMD ["bash", "-c", "python fetch_issuer_links.py && python scraper.py && python metrics_computer.py && python calculate_performance_metrics.py && python news_sentiments.py && python PricePredictor.py"]
