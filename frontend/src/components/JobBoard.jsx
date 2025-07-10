import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    job_type: '',
    tag: '',
    sort: 'posting_date_desc',
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.job_type) params.job_type = filters.job_type;
      if (filters.tag) params.tag = filters.tag;
      if (filters.sort) params.sort = filters.sort;

      const response = await axios.get('http://localhost:5000/jobs', { params });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
    
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Filter Sidebar */}
          <aside>
            <div className="bg-white p-4 rounded shadow space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Location</h3>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g. London"
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Job Type</h3>
                <select
                  name="job_type"
                  value={filters.job_type}
                  onChange={handleFilterChange}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">All</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Tag</h3>
                <input
                  type="text"
                  name="tag"
                  value={filters.tag}
                  onChange={handleFilterChange}
                  placeholder="e.g. Pricing"
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Sort By</h3>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="posting_date_desc">Newest first</option>
                  <option value="posting_date_asc">Oldest first</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Job List */}
          <section className="md:col-span-2 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-gray-500">No jobs found.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-white p-4 rounded shadow flex justify-between">
                  <div className="flex gap-4">
                    <div>
                      <h4 className="font-bold text-blue-600">{job.title}</h4>
                      <p>{job.company}</p>
                      <div className="flex gap-2 flex-wrap mt-1 text-sm text-gray-600">
                        {job.location && (
                          <span className="bg-gray-200 px-2 py-1 rounded">{job.location}</span>
                        )}
                        {job.salary && (
                          <span className="bg-gray-200 px-2 py-1 rounded">{job.salary}</span>
                        )}
                        {job.job_type && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{job.job_type}</span>
                        )}
                        {job.tags.map((tag, i) => (
                          <span key={i} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            Apply
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {job.posting_date && (
                      <p className="text-gray-400">
                        Posted: {new Date(job.posting_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>
    </>
  );
}
