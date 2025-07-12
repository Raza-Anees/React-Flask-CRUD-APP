from flask import Blueprint, request, jsonify
from models.job import Job
from db import db
from sqlalchemy import desc, asc
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

job_bp = Blueprint('job_routes', __name__)

def validate_job_data(data, required_fields):
    """
    Validate job data and return errors if any
    """
    errors = {}
    
    # Check required fields
    for field in required_fields:
        if not data.get(field) or not str(data.get(field)).strip():
            errors[field] = f"{field} is required and cannot be empty"
    
    # validation for specific fields
    if data.get('title') and len(str(data['title']).strip()) > 40:
        errors['title'] = "Title must be 40 characters or less"
    
    if data.get('company') and len(str(data['company']).strip()) > 40:
        errors['company'] = "Company name must be 40 characters or less"
    
    if data.get('location') and len(str(data['location']).strip()) > 200:
        errors['location'] = "Location must be 200 characters or less"
    
    if data.get('job_type') and len(str(data['job_type']).strip()) > 100:
        errors['job_type'] = "Job type must be 100 characters or less"
    
    if data.get('salary') and len(str(data['salary']).strip()) > 100:
        errors['salary'] = "Salary must be 100 characters or less"
    
    if data.get('url') and len(str(data['url']).strip()) > 500:
        errors['url'] = "URL must be 500 characters or less"
    
    # Validate posting_date format if provided
    if data.get('posting_date'):
        try:
            datetime.strptime(data['posting_date'], '%Y-%m-%d')
        except ValueError:
            errors['posting_date'] = "Invalid date format. Use YYYY-MM-DD"
    
    return errors

@job_bp.route('/jobs', methods=['GET'])
def get_jobs():
    """
    Get all jobs with optional filtering and sorting
    """
    try:
        query = Job.query

        # Filtering
        job_type = request.args.get('job_type')
        location = request.args.get('location')
        tag = request.args.get('tag')

        if job_type:
            query = query.filter_by(job_type=job_type)
        if location:
            query = query.filter(Job.location.ilike(f'%{location}%'))
        if tag:
            query = query.filter(Job.tags.ilike(f'%{tag}%'))

        # Sorting
        sort = request.args.get('sort', 'posting_date_desc')
        if sort == 'posting_date_asc':
            query = query.order_by(asc(Job.posting_date))
        else:
            query = query.order_by(desc(Job.posting_date))

        jobs = query.all()
        return jsonify([job.to_dict() for job in jobs]), 200
        
    except Exception as e:
        logger.error(f"Error fetching jobs: {str(e)}")
        return jsonify({'error': 'Internal server error occurred while fetching jobs'}), 500

@job_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """
    Get a specific job by ID
    """
    try:
        if job_id <= 0:
            return jsonify({'error': 'Invalid job ID'}), 400
            
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
            
        return jsonify(job.to_dict()), 200
        
    except Exception as e:
        logger.error(f"Error fetching job {job_id}: {str(e)}")
        return jsonify({'error': 'Internal server error occurred while fetching job'}), 500

@job_bp.route('/jobs', methods=['POST'])
def create_job():
    """
    Create a new job
    """
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        # Validate required fields
        required_fields = ['title', 'company', 'location']
        errors = validate_job_data(data, required_fields)

        if errors:
            return jsonify({'errors': errors}), 400

        # Create job with proper error handling
        try:
            job = Job(
                title=data['title'].strip(),
                company=data['company'].strip(),
                location=data['location'].strip(),
                posting_date=datetime.strptime(data.get('posting_date'), '%Y-%m-%d') if data.get('posting_date') else datetime.utcnow(),
                job_type=data.get('job_type', '').strip() if data.get('job_type') else None,
                tags=','.join(data.get('tags', [])) if isinstance(data.get('tags'), list) else data.get('tags', ''),
                description=data.get('description', '').strip() if data.get('description') else None,
                salary=data.get('salary', '').strip() if data.get('salary') else None,
                url=data.get('url', '').strip() if data.get('url') else None
            )

            db.session.add(job)
            db.session.commit()
            
            return jsonify(job.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Database error while creating job: {str(e)}")
            return jsonify({'error': 'Failed to create job due to database error'}), 500
            
    except Exception as e:
        logger.error(f"Error creating job: {str(e)}")
        return jsonify({'error': 'Internal server error occurred while creating job'}), 500

@job_bp.route('/jobs/<int:job_id>', methods=['PUT', 'PATCH'])
def update_job(job_id):
    """
    Update a job by ID
    """
    try:
        if job_id <= 0:
            return jsonify({'error': 'Invalid job ID'}), 400
            
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        # Validate data if provided
        if any(field in data for field in ['title', 'company', 'location']):
            required_fields = []
            if 'title' in data:
                required_fields.append('title')
            if 'company' in data:
                required_fields.append('company')
            if 'location' in data:
                required_fields.append('location')
                
            errors = validate_job_data(data, required_fields)
            if errors:
                return jsonify({'errors': errors}), 400

        try:
            # Update fields
            if 'title' in data:
                job.title = data['title'].strip()
            if 'company' in data:
                job.company = data['company'].strip()
            if 'location' in data:
                job.location = data['location'].strip()
            if 'job_type' in data:
                job.job_type = data['job_type'].strip() if data['job_type'] else None
            if 'description' in data:
                job.description = data['description'].strip() if data['description'] else None
            if 'salary' in data:
                job.salary = data['salary'].strip() if data['salary'] else None
            if 'url' in data:
                job.url = data['url'].strip() if data['url'] else None
            if 'posting_date' in data:
                job.posting_date = datetime.strptime(data['posting_date'], '%Y-%m-%d')
            if 'tags' in data:
                job.tags = ','.join(data['tags']) if isinstance(data['tags'], list) else data['tags']

            db.session.commit()
            return jsonify(job.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Database error while updating job {job_id}: {str(e)}")
            return jsonify({'error': 'Failed to update job due to database error'}), 500
            
    except Exception as e:
        logger.error(f"Error updating job {job_id}: {str(e)}")
        return jsonify({'error': 'Internal server error occurred while updating job'}), 500

@job_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    """
    Delete a job by ID
    """
    try:
        if job_id <= 0:
            return jsonify({'error': 'Invalid job ID'}), 400
            
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        try:
            db.session.delete(job)
            db.session.commit()
            return '', 204
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Database error while deleting job {job_id}: {str(e)}")
            return jsonify({'error': 'Failed to delete job due to database error'}), 500
            
    except Exception as e:
        logger.error(f"Error deleting job {job_id}: {str(e)}")
        return jsonify({'error': 'Internal server error occurred while deleting job'}), 500
