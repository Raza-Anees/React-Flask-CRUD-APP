from flask import Blueprint, request, jsonify
from models.job import Job
from db import db
from sqlalchemy import desc, asc
from datetime import datetime  

job_bp = Blueprint('job_routes', __name__)

def validate_job_data(data, required_fields):
    errors = {}
    for field in required_fields:
        if not data.get(field):
            errors[field] = f"{field} is required"
    return errors

@job_bp.route('/jobs', methods=['GET'])
def get_jobs():
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
    return jsonify([job.to_dict() for job in jobs])

@job_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    return jsonify(job.to_dict())

@job_bp.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    errors = validate_job_data(data, ['title', 'company', 'location'])

    if errors:
        return jsonify({'errors': errors}), 400

    job = Job(
        title=data['title'],
        company=data['company'],
        location=data['location'],
        posting_date=datetime.strptime(data.get('posting_date'), '%Y-%m-%d') if data.get('posting_date') else datetime.utcnow(),
        job_type=data.get('job_type'),
        tags=','.join(data.get('tags', [])) if isinstance(data.get('tags'), list) else data.get('tags'),
        description=data.get('description'),
        salary=data.get('salary'),
        url=data.get('url')
    )

    db.session.add(job)
    db.session.commit()
    return jsonify(job.to_dict()), 201

@job_bp.route('/jobs/<int:job_id>', methods=['PUT', 'PATCH'])
def update_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    data = request.get_json()
    for field in ['title', 'company', 'location', 'job_type', 'description', 'salary', 'url']:
        if field in data:
            setattr(job, field, data[field])
    if 'posting_date' in data:
        job.posting_date = datetime.strptime(data['posting_date'], '%Y-%m-%d')
    if 'tags' in data:
        job.tags = ','.join(data['tags']) if isinstance(data['tags'], list) else data['tags']

    db.session.commit()
    return jsonify(job.to_dict())

@job_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    db.session.delete(job)
    db.session.commit()
    return '', 204
