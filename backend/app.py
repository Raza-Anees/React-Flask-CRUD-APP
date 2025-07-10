# backend/app.py
from flask import Flask
from flask_cors import CORS
from db import init_db
from routes.job_routes import job_bp

app = Flask(__name__)
CORS(app)
init_db(app)

# Register blueprints
app.register_blueprint(job_bp)

if __name__ == '__main__':
    app.run(debug=True)
