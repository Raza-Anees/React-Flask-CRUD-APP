#!/usr/bin/env python3
"""
Actuary List Scraper Runner

This script runs the Actuary List scraper to populate the job board database.
"""

import os
import sys
from actuary_scraper_v2 import ActuaryListScraper

def main():
    """Main function to run the scraper"""
    print("=" * 50)
    print("Actuary List Job Scraper")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('../backend'):
        print("Error: Backend directory not found. Please run this script from the Scraper directory.")
        sys.exit(1)
    
    # Set up environment variables if not already set
    if not os.getenv('DB_USER'):
        print("Warning: Database environment variables not set.")
        print("Please ensure your .env file is properly configured.")
    
    try:
        # Create scraper instance
        scraper = ActuaryListScraper(headless=True, max_jobs=50)
        
        print("Starting job scraping...")
        jobs_data = scraper.scrape_jobs()
        
        if jobs_data:
            print(f"\nSuccessfully scraped {len(jobs_data)} jobs!")
            
            # Save to database
            print("Saving jobs to database...")
            scraper.save_jobs_to_database(jobs_data)
            
            print("\nScraping completed successfully!")
        else:
            print("\nNo jobs were scraped. This might be due to:")
            print("- Website structure changes")
            print("- Anti-scraping measures")
            print("- Network issues")
            print("- Site being down")
            print("\nPlease check the website manually to verify it's accessible.")
    
    except KeyboardInterrupt:
        print("\nScraping interrupted by user.")
    except Exception as e:
        print(f"\nError during scraping: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 