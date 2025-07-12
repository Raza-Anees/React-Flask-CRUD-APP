# Job Board Application

A full-stack job board application with a React frontend, Flask backend, and web scraping functionality.

## Project Structure

```
project-root/
├── frontend/          # React application
├── backend/           # Flask API server
└── Scraper/          # Web scraping scripts
```

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

## Getting Started

### 1. Backend Setup

Navigate to the backend directory and set up the Flask server:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend server will start on `http://localhost:5000`

### 2. Frontend Setup

Navigate to the frontend directory and set up the React application:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

### 3. Scraper Setup

Navigate to the Scraper directory and set up the web scraping scripts:

```bash
cd Scraper

# Run the scraper
python run_scraper.py
```

## Running All Components

To run the entire application, you'll need three terminal windows:

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3 - Scraper (when needed)
```bash
cd Scraper
venv\Scripts\activate  # Windows
python run_scraper.py
```

## API Endpoints

The backend provides the following endpoints:

- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/<id>` - Update a job
- `DELETE /api/jobs/<id>` - Delete a job

## Features

- **Frontend**: React-based job board interface with filtering and sorting capabilities
- **Backend**: Flask REST API for job management
- **Scraper**: Automated web scraping for job data collection

## Development

- Frontend: React with Vite
- Backend: Flask with SQLAlchemy
- Database: SQLite (configurable)
- Scraper: Selenium-based web scraping

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 