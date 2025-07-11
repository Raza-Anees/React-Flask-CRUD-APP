import React, { useState, useEffect } from 'react';
import { addJob, editJob, getJob } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
  title: '',
  company: '',
  location: '',
  description: '',
  salary: '',
  url: '',
  posting_date: '',
  job_type: '',
  tags: '',
};

const locationsList = [
  'Remote', 'London', 'New York NY', 'Bangalore', 'Chicago IL', 'Boston MA', 'Saint Paul MN', 'Munich', 'Atlanta GA', 'Toronto', 'Singapore', 'Hartford CT', 'Noida', 'Parsippany NJ', 'Seattle WA', 'Manchester', 'Sydney', 'Philadelphia PA', 'Zürich', 'Charlotte NC', 'Hong Kong', 'Orlando FL', 'Edinburgh', 'Oakland CA', 'Armonk NY', 'Bristol', 'Glasgow', 'Rosemont IL', 'Seoul', 'Birmingham', 'Cincinnati OH', 'Dublin', 'Hanover', 'Hove', 'Leeds', 'Alpharetta GA', 'Blue Bell PA', 'Denver CO', 'Kansas City MO', 'Lisbon', 'Mexico City', 'Sun Prairie WI', 'Dallas TX', 'Indianapolis IN', 'Kuala Lumpur', 'Nashville TN', 'Columbus OH', 'Houston TX', 'Minnetonka MN', 'Paris', 'Portland OR', 'Richmond VA', 'Shanghai', 'Jersey City NJ', 'Johannesburg', 'Louisville KY', 'Madrid', 'Minneapolis MN', 'Omaha NE', 'Princeton NJ', 'Stratford-upon-Avon', 'Woonsocket RI', 'Arlington VA', 'Austin TX', 'Bloomfield NJ', 'Des Moines IA', 'Fort Wayne IN', 'Los Angeles CA', 'Melbourne', 'Potters Bar', 'Reigate', 'Rolling Meadows IL', 'San Antonio TX', 'San Francisco CA', 'Taguig', 'Canberra', 'Hamilton', 'Hunt Valley MD', 'Miami FL', 'Montreal', 'Morristown NJ', 'Mumbai', 'Pakistan', 'Petaling Jaya', 'Plano TX', 'Prague', 'Reading', 'Schaumburg IL', 'Tampa FL', 'Tempe AZ', 'Baltimore MD', 'Bedford TX', 'Belfast', 'Bermuda', 'Bloomington IL', 'Boca Raton FL', 'Bratislava', 'Brussels', 'Budapest', 'Detroit MI', 'Dubai', 'Eden Prairie MN', 'Glen Allen VA', 'Grand Rapids MI', 'Irvine CA', 'Jacksonville FL', 'Milan', 'Milwaukee WI', 'Newport Beach CA', 'Northfield Township IL', 'Pasadena CA', 'Pembroke', 'Phoenix AZ', 'Pittsburgh PA', 'Potomac MD', 'Stamford CT', 'Summit NJ', 'São Paulo', 'Vienna', 'Wilton CT', 'Albany NY', 'Alexandria VA', 'Beijing', 'Bethlehem PA', 'Birmingham AL', 'Boise ID', 'Bridgewater NJ', 'Brighton', 'Brisbane', 'Brookfield WI', 'Buenos Aires', 'Cape Town', 'Cardiff', 'Cedar Rapids IA', 'Cleveland OH', 'Cologne', 'Costa Mesa CA', 'Croydon', 'Davenport IA', 'Dayton OH', 'Diegem', 'Farmington CT', 'Folkestone', 'Fort Worth TX', 'Franklin MA', 'Fresno CA', 'Galveston TX', 'Gurgaon', 'Harrisburg PA', 'Holmdel NJ', 'Hoofddorp', 'Hudson Yards NY', 'Hyattsville MD', 'Istanbul', 'Krakow', 'Las Vegas NV', 'Leatherhead', 'Macclesfield', 'Marblehead MA', 'McLean VA', 'Memphis TN', 'Midland MI', 'New Orleans LA', 'Ramat Gan', 'Red Bank NJ', 'Richardson TX', 'Rotterdam', 'Salford', 'Scottsdale AZ', 'Short Hills NJ', 'St Louis MO', 'St Paul MN', 'Staines', 'Taipei City', 'The Hague', 'Tokyo', 'Walnut Creek CA', 'Whippany NJ', 'Woodland Hills CA', 'York'
];

export default function AddEditJob({ isEdit }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      getJob(id)
        .then(res => {
          const job = res.data;
          setFormData({
            ...job,
            tags: Array.isArray(job.tags) ? job.tags.join(', ') : job.tags || '',
            posting_date: job.posting_date ? job.posting_date.slice(0, 10) : '',
          });
        })
        .catch(() => setApiError('Failed to load job details.'));
    }
  }, [isEdit, id]);

  const validate = () => {
    const errs = {};
    if (!formData.title) errs.title = 'Title is required';
    if (!formData.company) errs.company = 'Company is required';
    if (!formData.location) errs.location = 'Location is required';
    if (!formData.posting_date) errs.posting_date = 'Posting date is required';
    if (!formData.job_type) errs.job_type = 'Job type is required';
    return errs;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    try {
      if (isEdit && id) {
        await editJob(id, payload);
        setSuccess('Job updated successfully.');
      } else {
        await addJob(payload);
        setSuccess('Job added successfully.');
        setFormData(initialState);
      }
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setApiError(
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).join(', ')
          : 'Failed to submit job.'
      );
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isEdit ? 'Edit Job' : 'Post a New Job'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title, Company, Posting Date fields */}
          {['title', 'company', 'posting_date'].map(field => (
            <div key={field}>
              <input
                name={field}
                type={field === 'posting_date' ? 'date' : 'text'}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === 'posting_date'
                    ? 'Posting Date'
                    : field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                disabled={loading}
              />
              {errors[field] && <div className="text-red-500 text-sm mt-1">{errors[field]}</div>}
            </div>
          ))}
          {/* Location Dropdown */}
          <div>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              disabled={loading}
            >
              <option value="">Select Location</option>
              {locationsList.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
          </div>
          {/* Job Type Dropdown */}
          <div>
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              disabled={loading}
            >
              <option value="">Select Job Type</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.job_type && <div className="text-red-500 text-sm mt-1">{errors.job_type}</div>}
          </div>
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <input
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <input
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="Job Link (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            disabled={loading}
          />
          {apiError && <div className="text-red-500 text-center">{apiError}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
            disabled={loading}
          >
            {loading ? 'Submitting...' : isEdit ? 'Update Job' : 'Submit Job'}
          </button>
        </form>
      </div>
    </div>
  );
} 