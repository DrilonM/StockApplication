import sqlite3
import pandas as pd
import requests
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader, PdfFileReader
from io import BytesIO
import os
from textblob import TextBlob

from fontTools.merge.util import current_time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver import Chrome, ChromeOptions
import time

def initialize_table(conn):
    conn.execute('''
                CREATE TABLE IF NOT EXISTS news_sentiments (
                    issuer TEXT, 
                    link TEXT,
                    date TEXT,
                    title TEXT,
                    content TEXT, 
                    sentiment TEXT,
                    PRIMARY KEY (issuer, date, title)
                 )
            ''')
    conn.commit()
    return conn

def fetch_articles(link):
    response = requests.get(link)

    soup = BeautifulSoup(response.content, 'html.parser')

    containers = soup.find_all(class_='container-seinet')

    article_links = []
    dates = []

    for container in containers:
        article = container.find('a')
        article_links.append(article['href'])
        text = article.find('h4').text
        date = text.split(' - ')[0]
        dates.append(date)

    return article_links, dates


def is_file_in_directory(directory, title):
    files = os.listdir(directory)
    for file in files:
        if title in file:
            return True
    return False

def wait_for_download(download_dir, title, timeout=60):
    start_time = time.time()
    while True:
        if is_file_in_directory(download_dir, title):
            return

        if time.time() - start_time > timeout:
            raise TimeoutError(f"File '{title}' not found in the directory within {timeout} seconds.")

        time.sleep(1)

def extract_news(article_links, dates, issuer, conn):
    options = Options()

    path = os.getcwd()
    download_dir = path.replace("scripts", "articles")

    options.add_experimental_option("prefs", {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "download.folderList": 2
    })

    driver = webdriver.Edge(options=options)

    for link, date in zip(article_links, dates):
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM news_sentiments WHERE link = ?", (link,))
        if cursor.fetchone():
            print(f"Link already processed. Skipping...")
            continue

        driver.get(link)

        try:
            time.sleep(0.5)

            download_buttons = driver.find_elements(By.XPATH, "//div[contains(@title, '.pdf')]")

            paragraphs = driver.find_elements(by=By.TAG_NAME, value='p')
            paragraph_text = ""



            for paragraph in paragraphs:
                paragraph_text += paragraph.text + "\n"

            if not download_buttons:
                print("Grabbing paragraphs")
                temp = paragraph_text
                title = temp.strip().split('\n')[0]

                if title.startswith("На оваа веб"):
                    continue

                if cursor.fetchone():
                    print(f"Title '{title}' already exists in the database. Skipping...")
                    continue

                conn.execute('''
                                            INSERT OR IGNORE INTO news_sentiments (issuer, link, date, title, content, sentiment)
                                            VALUES (?, ?, ?, ?, ?, ?)
                                        ''', (issuer, link, date, title, paragraph_text, calculate_sentiment(paragraph_text)))
                continue

            for button in download_buttons:
                title = button.get_attribute('title').split("Превземи датотека ")[1]
                print(title)
                cursor.execute("SELECT 1 FROM news_sentiments WHERE title = ?", (title, ))
                if cursor.fetchone():
                    print(f"Title '{title}' already exists in the database. Skipping...")
                    continue

                button.click()
                # print("Download started...")

                wait_for_download(download_dir, title)

                # print(f"Download completed! Check folder: {download_dir}")

                read_pdf(issuer, title, link, date, conn)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            continue

    conn.commit()
    driver.quit()


def read_pdf(issuer, file_name, link, date, conn):
    path = os.getcwd()
    pdf_directory = path.replace("scripts", "articles")

    pdf_path = os.path.join(pdf_directory, file_name)

    if file_name.endswith(".pdf"):
        print(f"Reading PDF: {file_name}")

        try:
            reader = PdfReader(pdf_path)
            content = ""
            for page_number, page in enumerate(reader.pages):
                page_text = page.extract_text()
                content += page_text

            sentiment = calculate_sentiment(content)

            # title = file_name.split(".pdf")[0]
            title = file_name

            conn.execute('''
                        INSERT OR REPLACE INTO news_sentiments (issuer, link, date, title, content, sentiment)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ''', (issuer, link, date, title, content, sentiment))
            conn.commit()

            time.sleep(1)

            print(f"Committed {file_name}")

            os.remove(pdf_path)

            print(f"Successfully deleted {file_name}")

        except Exception as e:
            print(f"Error reading {file_name}: {e}")
            return

    print(f"{file_name} processed and deleted.")


def calculate_sentiment(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity

    if sentiment > 0:
        return "Positive news"
    elif sentiment < 0:
        return "Negative news"
    else:
        return "Neutral news"

DB_PATH = "../../database/stock_data.db"

def main():
    conn = sqlite3.connect(DB_PATH)
    conn = initialize_table(conn)

    issuers = pd.read_sql_query("SELECT * FROM issuer_links", conn)['issuer'].tolist()
    links = pd.read_sql_query("SELECT * FROM issuer_links", conn)['link'].tolist()

    for issuer, link in zip(issuers, links):
        article_links, dates = fetch_articles(link)
        extract_news(article_links, dates, issuer, conn)

    # article_links, dates = fetch_articles("https://www.mse.mk/en/issuer/alkaloid-ad-skopje")
    # extract_news(article_links, dates, "ALK", conn)

    conn.close()
main()