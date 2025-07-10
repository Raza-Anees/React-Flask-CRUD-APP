# Job Listings Backend

A Flask-based RESTful API for managing job listings with Selenium integration for automated job scraping.

## Features

- RESTful API for job listings (CRUD operations)
- PostgreSQL database integration
- Selenium-based job scraping
- Automatic job deduplication

## Prerequisites

- Python 3.8+
- PostgreSQL
- Chrome browser (for Selenium)

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up PostgreSQL database:
- Create a new database named `job_listings`
- Update the database URL in `.env` file if needed

4. Create a `.env` file:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/job_listings
```

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

- `GET /jobs` - Get all job listings
- `GET /jobs/<id>` - Get a specific job listing
- `POST /jobs` - Create a new job listing
- `PUT /jobs/<id>` - Update a job listing
- `DELETE /jobs/<id>` - Delete a job listing
- `POST /jobs/scrape` - Scrape and add new jobs

## Example Usage

1. Create a new job:
```bash
curl -X POST http://localhost:5000/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "company": "Tech Corp",
    "location": "New York",
    "description": "Looking for a software engineer...",
    "salary": "$100k-$150k",
    "url": "https://example.com/job/123"
  }'
```

2. Scrape jobs:
```bash
curl -X POST http://localhost:5000/jobs/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/jobs"
  }'
```

## Customizing the Selenium Scraper

The `selenium_bot.py` file contains a template for job scraping. You'll need to customize the selectors and logic based on the specific job board you're scraping. Update the following:

1. The URL in the `scrape_jobs` function
2. The CSS selectors in the `scrape_jobs` method
3. The job data extraction logic

## Error Handling

The API includes basic error handling for:
- Missing required fields
- Invalid job IDs
- Database errors
- Scraping errors

## Contributing

Feel free to submit issues and enhancement requests! 