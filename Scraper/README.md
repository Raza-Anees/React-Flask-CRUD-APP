# Actuary List Job Scraper

This scraper extracts job listings from [Actuary List](https://www.actuarylist.com) and imports them into your application's database.

## Features

- **Automated Data Extraction**: Uses Selenium to navigate and extract job data
- **Comprehensive Data Collection**: Captures job title, company, location, posting date, job type, tags, and description
- **Duplicate Prevention**: Checks for existing jobs before inserting new ones
- **Error Handling**: Gracefully handles missing data and network issues
- **Configurable**: Adjustable number of jobs to scrape and headless mode

## Requirements

- Python 3.7+
- Chrome browser installed
- ChromeDriver (automatically managed by Selenium)
- PostgreSQL database (as configured in your backend)

## Installation

1. **Install Python dependencies**:
   ```bash
   cd Scraper
   pip install -r requirements.txt
   ```

2. **Ensure your backend is properly configured**:
   - Make sure your `.env` file in the backend directory has the correct database credentials
   - Ensure the backend can connect to the database

3. **Verify Chrome/ChromeDriver**:
   - Chrome browser should be installed
   - Selenium will automatically download the appropriate ChromeDriver version

## Usage

### Basic Usage

Run the scraper from the Scraper directory:

```bash
cd Scraper
python run_scraper.py
```

### Advanced Usage

You can also import and use the scraper programmatically:

```python
from actuary_scraper_v2 import ActuaryListScraper

# Create scraper instance
scraper = ActuaryListScraper(headless=False, max_jobs=100)

# Scrape jobs
jobs_data = scraper.scrape_jobs()

# Save to database
scraper.save_jobs_to_database(jobs_data)
```

## Configuration

### Scraper Parameters

- `headless` (bool): Run browser in headless mode (default: True)
- `max_jobs` (int): Maximum number of jobs to scrape (default: 50)

### Data Extracted

For each job listing, the scraper attempts to extract:

**Required Fields:**
- Job Title
- Company Name
- Location (city/country)
- Posting Date

**Optional Fields:**
- Job Type (Full-Time, Part-Time, Intern, Contract)
- Tags/Keywords (Life, Health, Python, Pricing, etc.)
- Job Description
- Job URL
- Salary (if available)

## How It Works

1. **Browser Setup**: Launches Chrome with anti-detection measures
2. **Navigation**: Loads the Actuary List website
3. **Element Detection**: Uses multiple CSS selectors to find job listings
4. **Data Extraction**: Parses each job element for relevant information
5. **Date Parsing**: Converts relative dates ("posted 2 days ago") to datetime objects
6. **Job Type Inference**: Intelligently determines job type from content
7. **Database Integration**: Saves jobs to your PostgreSQL database
8. **Duplicate Prevention**: Checks for existing jobs before insertion

## Error Handling

The scraper handles various scenarios:

- **Missing Elements**: Uses fallback selectors when primary selectors fail
- **Network Issues**: Graceful timeout and retry mechanisms
- **Anti-Scraping Measures**: Implements user-agent spoofing and other evasion techniques
- **Database Errors**: Rollback on failed transactions
- **Missing Data**: Provides sensible defaults for optional fields

## Troubleshooting

### Common Issues

1. **"No jobs scraped"**
   - Check if the website is accessible manually
   - Verify your internet connection
   - The website structure may have changed

2. **"Database connection error"**
   - Ensure your `.env` file is properly configured
   - Check that PostgreSQL is running
   - Verify database credentials

3. **"ChromeDriver not found"**
   - Selenium should automatically download the correct version
   - If issues persist, manually download ChromeDriver and specify the path

4. **"Permission denied"**
   - Ensure you have write permissions in the Scraper directory
   - Check that Chrome can be launched

### Debug Mode

To run the scraper in debug mode (non-headless):

```python
scraper = ActuaryListScraper(headless=False, max_jobs=10)
```

This will open a visible browser window so you can see what the scraper is doing.

## Limitations

- **Rate Limiting**: The scraper respects reasonable request rates
- **Scope**: Currently scrapes the first 50 jobs by default
- **Website Changes**: May need updates if Actuary List changes their structure
- **Anti-Scraping**: Some websites may implement measures that could affect scraping

## File Structure

```
Scraper/
├── actuary_scraper_v2.py    # Main scraper implementation
├── run_scraper.py           # Simple runner script
├── requirements.txt          # Python dependencies
├── README.md               # This file
└── scrape.py               # Original basic scraper
```

## Contributing

To improve the scraper:

1. Test with different job listing structures
2. Add new CSS selectors for better element detection
3. Implement additional data extraction methods
4. Add support for other job board websites

## Notes

- The scraper is designed for demonstration purposes
- It's not intended for continuous production use
- Always respect website terms of service and robots.txt
- Consider implementing delays between requests for production use 