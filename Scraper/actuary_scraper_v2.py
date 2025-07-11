import sys
import os
import time
import re
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
import requests
from bs4 import BeautifulSoup

# Add the backend directory to the path so we can import our models
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app
from models.job import Job
from db import db

class ActuaryListScraper:
    def __init__(self, headless=True, max_jobs=50):
        self.headless = headless
        self.max_jobs = max_jobs
        self.driver = None
        self.jobs_scraped = 0
        
    def setup_driver(self):
        """Setup Chrome driver with appropriate options"""
        options = Options()
        
        if self.headless:
            options.add_argument("--headless")
        
        # Add options to avoid detection
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        options.add_argument("--window-size=1920,1080")
        
        # Set user agent
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        try:
            self.driver = webdriver.Chrome(options=options)
            # Execute script to remove webdriver property
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            return True
        except Exception as e:
            print(f"Error setting up driver: {e}")
            return False
    
    def parse_date(self, date_text):
        """Parse relative date text to datetime object"""
        if not date_text:
            return datetime.utcnow()
        
        date_text = date_text.lower().strip()
        
        # Handle "posted X days ago"
        days_match = re.search(r'(\d+)\s*days?\s*ago', date_text)
        if days_match:
            days = int(days_match.group(1))
            return datetime.utcnow() - timedelta(days=days)
        
        # Handle "posted X hours ago"
        hours_match = re.search(r'(\d+)\s*hours?\s*ago', date_text)
        if hours_match:
            hours = int(hours_match.group(1))
            return datetime.utcnow() - timedelta(hours=hours)
        
        # Handle "posted X weeks ago"
        weeks_match = re.search(r'(\d+)\s*weeks?\s*ago', date_text)
        if weeks_match:
            weeks = int(weeks_match.group(1))
            return datetime.utcnow() - timedelta(weeks=weeks)
        
        # Handle "posted X months ago"
        months_match = re.search(r'(\d+)\s*months?\s*ago', date_text)
        if months_match:
            months = int(months_match.group(1))
            return datetime.utcnow() - timedelta(days=months*30)
        
        # If we can't parse it, return current time
        return datetime.utcnow()
    
    def infer_job_type(self, title, description, tags):
        """Infer job type from title, description, and tags"""
        text_to_check = f"{title} {description} {tags}".lower()
        
        if any(word in text_to_check for word in ['intern', 'internship']):
            return 'Intern'
        elif any(word in text_to_check for word in ['part-time', 'part time', 'contract']):
            return 'Part-Time'
        elif any(word in text_to_check for word in ['freelance', 'consultant']):
            return 'Contract'
        else:
            return 'Full-Time'
    
    def extract_job_data_from_element(self, job_element):
        """Extract job data from a job listing element"""
        try:
            # Try multiple selectors for job title
            title_selectors = [
                'h1', 'h2', 'h3', 'h4',
                '.job-title', '.title', '[class*="title"]',
                '.job-name', '.position-title'
            ]
            
            title = None
            for selector in title_selectors:
                try:
                    title_element = job_element.find_element(By.CSS_SELECTOR, selector)
                    title = title_element.text.strip()
                    if title:
                        break
                except NoSuchElementException:
                    continue
            
            if not title:
                # Try to find any text that looks like a job title
                text_elements = job_element.find_elements(By.CSS_SELECTOR, 'p, span, div')
                for element in text_elements:
                    text = element.text.strip()
                    if text and len(text) > 5 and len(text) < 100:
                        # Check if it looks like a job title
                        if any(word in text.lower() for word in ['actuary', 'analyst', 'manager', 'director', 'consultant', 'specialist']):
                            title = text
                            break
            
            # Try multiple selectors for company name
            company_selectors = [
                '.company', '.employer', '[class*="company"]',
                '.organization', '.firm'
            ]
            
            company = None
            for selector in company_selectors:
                try:
                    company_element = job_element.find_element(By.CSS_SELECTOR, selector)
                    company = company_element.text.strip()
                    if company:
                        break
                except NoSuchElementException:
                    continue
            
            # Try multiple selectors for location
            location_selectors = [
                '.location', '.city', '[class*="location"]',
                '.address', '.place'
            ]
            
            location = None
            for selector in location_selectors:
                try:
                    location_element = job_element.find_element(By.CSS_SELECTOR, selector)
                    location = location_element.text.strip()
                    if location:
                        break
                except NoSuchElementException:
                    continue
            
            # Try multiple selectors for posting date
            date_selectors = [
                '.date', '.posted', '[class*="date"]',
                '.time', '.timestamp'
            ]
            
            posting_date = datetime.utcnow()
            for selector in date_selectors:
                try:
                    date_element = job_element.find_element(By.CSS_SELECTOR, selector)
                    posting_date = self.parse_date(date_element.text)
                    break
                except NoSuchElementException:
                    continue
            
            # Get job URL
            url = None
            try:
                link_element = job_element.find_element(By.CSS_SELECTOR, 'a')
                url = link_element.get_attribute('href')
            except NoSuchElementException:
                pass
            
            # Extract tags/keywords
            tags = []
            tag_selectors = [
                '.tag', '.keyword', '.category', '[class*="tag"]',
                '.skill', '.technology'
            ]
            
            for selector in tag_selectors:
                try:
                    tag_elements = job_element.find_elements(By.CSS_SELECTOR, selector)
                    for tag_element in tag_elements:
                        tag_text = tag_element.text.strip()
                        if tag_text and tag_text not in tags:
                            tags.append(tag_text)
                except:
                    continue
            
            # Extract description
            description = ""
            desc_selectors = [
                '.description', '.summary', '[class*="desc"]',
                '.details', '.content'
            ]
            
            for selector in desc_selectors:
                try:
                    desc_element = job_element.find_element(By.CSS_SELECTOR, selector)
                    description = desc_element.text.strip()
                    if description:
                        break
                except NoSuchElementException:
                    continue
            
            # If we still don't have a description, try to get it from the job card
            if not description:
                # Get all text from the job element and use it as description
                all_text = job_element.text.strip()
                # Remove title, company, location from the text
                if title:
                    all_text = all_text.replace(title, '')
                if company:
                    all_text = all_text.replace(company, '')
                if location:
                    all_text = all_text.replace(location, '')
                description = all_text.strip()
            
            # Infer job type
            job_type = self.infer_job_type(title or '', description, ' '.join(tags))
            
            return {
                'title': title,
                'company': company,
                'location': location,
                'posting_date': posting_date,
                'job_type': job_type,
                'tags': ','.join(tags) if tags else None,
                'description': description,
                'url': url,
                'salary': None
            }
            
        except Exception as e:
            print(f"Error extracting job data: {e}")
            return None
    
    def scrape_jobs(self):
        """Main method to scrape jobs from Actuary List"""
        if not self.setup_driver():
            return False
        
        try:
            # Navigate to Actuary List
            print("Navigating to Actuary List...")
            self.driver.get("https://www.actuarylist.com")
            
            # Wait for page to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Print page title to confirm we're on the right site
            print(f"Page title: {self.driver.title}")
            
            # Look for job listings with various selectors
            print("Looking for job listings...")
            
            # Try different approaches to find job listings
            job_elements = []
            
            # Method 1: Look for specific job-related selectors
            job_selectors = [
                '.job-listing', '.job-card', '.job-item',
                '[class*="job"]', '.listing', '.card',
                '.post', '.position', '.opportunity'
            ]
            
            for selector in job_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        job_elements = elements
                        print(f"Found {len(elements)} job elements using selector: {selector}")
                        break
                except:
                    continue
            
            # Method 2: If no specific selectors found, look for any clickable elements
            if not job_elements:
                print("No specific job selectors found, trying alternative approach...")
                
                # Look for any divs that might contain job information
                all_divs = self.driver.find_elements(By.TAG_NAME, "div")
                
                # Filter divs that might be job listings based on content
                for div in all_divs:
                    try:
                        text = div.text.strip()
                        if text and len(text) > 50:  # Reasonable amount of text
                            # Check if it contains job-related keywords
                            if any(keyword in text.lower() for keyword in ['actuary', 'analyst', 'job', 'position', 'opportunity', 'career']):
                                job_elements.append(div)
                    except:
                        continue
                
                print(f"Found {len(job_elements)} potential job elements using content analysis")
            
            # Method 3: If still no elements, try to find any structured content
            if not job_elements:
                print("Trying to find any structured content...")
                
                # Look for any elements with substantial text content
                all_elements = self.driver.find_elements(By.CSS_SELECTOR, "div, article, section")
                for element in all_elements:
                    try:
                        text = element.text.strip()
                        if text and len(text) > 100:  # Substantial content
                            job_elements.append(element)
                    except:
                        continue
                
                # Limit to first 20 elements to avoid too many
                job_elements = job_elements[:20]
                print(f"Found {len(job_elements)} content elements")
            
            print(f"Total potential job elements found: {len(job_elements)}")
            
            # Extract job data
            jobs_data = []
            for i, element in enumerate(job_elements):
                if self.jobs_scraped >= self.max_jobs:
                    break
                
                print(f"Processing element {i+1}/{len(job_elements)}")
                job_data = self.extract_job_data_from_element(element)
                
                if job_data and job_data['title'] and job_data['company']:
                    jobs_data.append(job_data)
                    self.jobs_scraped += 1
                    print(f"Scraped job {self.jobs_scraped}: {job_data['title']} at {job_data['company']}")
                else:
                    print(f"Could not extract job data from element {i+1}")
            
            print(f"Total jobs successfully scraped: {len(jobs_data)}")
            return jobs_data
            
        except Exception as e:
            print(f"Error during scraping: {e}")
            import traceback
            traceback.print_exc()
            return []
        finally:
            if self.driver:
                self.driver.quit()
    
    def save_jobs_to_database(self, jobs_data):
        """Save scraped jobs to the database"""
        with app.app_context():
            saved_count = 0
            duplicate_count = 0
            
            for job_data in jobs_data:
                try:
                    # Check if job already exists (title + company combination)
                    existing_job = Job.query.filter_by(
                        title=job_data['title'],
                        company=job_data['company']
                    ).first()
                    
                    if existing_job:
                        duplicate_count += 1
                        print(f"Duplicate job found: {job_data['title']} at {job_data['company']}")
                        continue
                    
                    # Create new job
                    new_job = Job(**job_data)
                    db.session.add(new_job)
                    saved_count += 1
                    print(f"Saved job: {job_data['title']} at {job_data['company']}")
                    
                except Exception as e:
                    print(f"Error saving job {job_data.get('title', 'Unknown')}: {e}")
            
            # Commit all changes
            try:
                db.session.commit()
                print(f"Successfully saved {saved_count} new jobs to database")
                print(f"Skipped {duplicate_count} duplicate jobs")
            except Exception as e:
                print(f"Error committing to database: {e}")
                db.session.rollback()

def main():
    """Main function to run the scraper"""
    print("Starting Actuary List scraper...")
    
    # Create scraper instance
    scraper = ActuaryListScraper(headless=True, max_jobs=50)
    
    # Scrape jobs
    jobs_data = scraper.scrape_jobs()
    
    if jobs_data:
        print(f"Scraped {len(jobs_data)} jobs successfully")
        
        # Save to database
        scraper.save_jobs_to_database(jobs_data)
    else:
        print("No jobs were scraped. This might be due to:")
        print("- Website structure changes")
        print("- Anti-scraping measures")
        print("- Network issues")
        print("- Site being down")

if __name__ == "__main__":
    main() 