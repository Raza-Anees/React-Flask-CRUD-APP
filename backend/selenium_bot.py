from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

class JobScraper:
    def __init__(self):
        self.options = Options()
        self.options.add_argument('--headless')  # Run in headless mode
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        
    def setup_driver(self):
        service = Service(ChromeDriverManager().install())
        return webdriver.Chrome(service=service, options=self.options)
    
    def scrape_jobs(self, url):
        """
        Scrape jobs from the given URL
        This is a template method - you'll need to customize the selectors and logic
        based on the specific job board you're scraping
        """
        driver = self.setup_driver()
        jobs = []
        
        try:
            driver.get(url)
            # Wait for job listings to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "job-listing"))
            )
            
            # Example scraping logic - customize based on the job board
            job_elements = driver.find_elements(By.CLASS_NAME, "job-listing")
            
            for job_element in job_elements:
                job = {
                    'title': job_element.find_element(By.CLASS_NAME, "job-title").text,
                    'company': job_element.find_element(By.CLASS_NAME, "company-name").text,
                    'location': job_element.find_element(By.CLASS_NAME, "location").text,
                    'description': job_element.find_element(By.CLASS_NAME, "description").text,
                    'url': job_element.find_element(By.TAG_NAME, "a").get_attribute("href"),
                    'salary': job_element.find_element(By.CLASS_NAME, "salary").text
                }
                jobs.append(job)
                
        except Exception as e:
            print(f"Error scraping jobs: {str(e)}")
        finally:
            driver.quit()
            
        return jobs

def scrape_jobs(url="https://example.com/jobs"):
    """
    Main function to scrape jobs
    """
    scraper = JobScraper()
    return scraper.scrape_jobs(url) 