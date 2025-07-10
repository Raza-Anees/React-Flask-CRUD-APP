from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import os
from config import CHROMEDRIVER_PATH

options = webdriver.ChromeOptions()
options.add_argument("--headless")
service = Service(CHROMEDRIVER_PATH)
driver = webdriver.Chrome(service=service, options=options)

url = "https://actuarylist.com/"
driver.get(url)
print(driver.title)

driver.quit()