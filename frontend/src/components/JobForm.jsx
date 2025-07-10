import React, { useState } from 'react';
import axios from 'axios';


const JobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    url: '',
    posting_date: '',
    job_type: '',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()), // convert to array
    };

    try {
      await axios.post('http://localhost:5000/jobs', payload);
      alert('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        url: '',
        posting_date: '',
        job_type: '',
        tags: ''
      });
    } catch (error) {
      console.error('Error submitting job:', error);
      alert('Failed to post job');
    }
  };

  return (
    <>
      
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Post a New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <input
              name="posting_date"
              type="date"
              value={formData.posting_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <input
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <input
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="Job Link (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Job Description"
              rows="5"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
            >
              Submit Job
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JobForm;
