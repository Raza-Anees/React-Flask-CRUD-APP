import React, { useEffect, useState, useMemo } from 'react';
import { getJobs } from '../api';
import FilterSortJob from './FilterSortJob';
import DeleteJob from './DeleteJob';
import { Link, useNavigate } from 'react-router-dom';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const tagsList = [
  'Risk', 'Pricing', 'Reporting', 'Coding', 'Microsoft Excel', 'Modelling', 'Reserving', 'Reinsurance', 'SQL', 'Python', 'Valuation', 'SAS', 'Consulting', 'VBA', 'Motor', 'Power BI', 'Data Science', 'Prophet', 'Bulk Annuities', 'AXIS', 'Experience Analysis', 'Longevity', 'ALM', 'Marine', 'ResQ', 'Tableau', 'Alteryx', 'Capital', 'Julia', 'MoSes', 'C++', 'RAFM', 'Data', 'Contract', 'Machine Learning', 'MG-ALFA', 'Radar', 'Emblem', 'Products', 'C#', 'Igloo', 'MATLAB', 'Databricks', 'ReMetrica', 'Tyche', 'Microsoft Azure', 'Oracle', 'Cyber', 'Marketing', 'JavaScript', 'Takaful', 'Psicle', 'Research'
];
const locationsList = [
  'Remote', 'London', 'New York NY', 'Bangalore', 'Chicago IL', 'Boston MA', 'Saint Paul MN', 'Munich', 'Atlanta GA', 'Toronto', 'Singapore', 'Hartford CT', 'Noida', 'Parsippany NJ', 'Seattle WA', 'Manchester', 'Sydney', 'Philadelphia PA', 'Zürich', 'Charlotte NC', 'Hong Kong', 'Orlando FL', 'Edinburgh', 'Oakland CA', 'Armonk NY', 'Bristol', 'Glasgow', 'Rosemont IL', 'Seoul', 'Birmingham', 'Cincinnati OH', 'Dublin', 'Hanover', 'Hove', 'Leeds', 'Alpharetta GA', 'Blue Bell PA', 'Denver CO', 'Kansas City MO', 'Lisbon', 'Mexico City', 'Sun Prairie WI', 'Dallas TX', 'Indianapolis IN', 'Kuala Lumpur', 'Nashville TN', 'Columbus OH', 'Houston TX', 'Minnetonka MN', 'Paris', 'Portland OR', 'Richmond VA', 'Shanghai', 'Jersey City NJ', 'Johannesburg', 'Louisville KY', 'Madrid', 'Minneapolis MN', 'Omaha NE', 'Princeton NJ', 'Stratford-upon-Avon', 'Woonsocket RI', 'Arlington VA', 'Austin TX', 'Bloomfield NJ', 'Des Moines IA', 'Fort Wayne IN', 'Los Angeles CA', 'Melbourne', 'Potters Bar', 'Reigate', 'Rolling Meadows IL', 'San Antonio TX', 'San Francisco CA', 'Taguig', 'Canberra', 'Hamilton', 'Hunt Valley MD', 'Miami FL', 'Montreal', 'Morristown NJ', 'Mumbai', 'Pakistan', 'Petaling Jaya', 'Plano TX', 'Prague', 'Reading', 'Schaumburg IL', 'Tampa FL', 'Tempe AZ', 'Baltimore MD', 'Bedford TX', 'Belfast', 'Bermuda', 'Bloomington IL', 'Boca Raton FL', 'Bratislava', 'Brussels', 'Budapest', 'Detroit MI', 'Dubai', 'Eden Prairie MN', 'Glen Allen VA', 'Grand Rapids MI', 'Irvine CA', 'Jacksonville FL', 'Milan', 'Milwaukee WI', 'Newport Beach CA', 'Northfield Township IL', 'Pasadena CA', 'Pembroke', 'Phoenix AZ', 'Pittsburgh PA', 'Potomac MD', 'Stamford CT', 'Summit NJ', 'São Paulo', 'Vienna', 'Wilton CT', 'Albany NY', 'Alexandria VA', 'Beijing', 'Bethlehem PA', 'Birmingham AL', 'Boise ID', 'Bridgewater NJ', 'Brighton', 'Brisbane', 'Brookfield WI', 'Buenos Aires', 'Cape Town', 'Cardiff', 'Cedar Rapids IA', 'Cleveland OH', 'Cologne', 'Costa Mesa CA', 'Croydon', 'Davenport IA', 'Dayton OH', 'Diegem', 'Farmington CT', 'Folkestone', 'Fort Worth TX', 'Franklin MA', 'Fresno CA', 'Galveston TX', 'Gurgaon', 'Harrisburg PA', 'Holmdel NJ', 'Hoofddorp', 'Hudson Yards NY', 'Hyattsville MD', 'Istanbul', 'Krakow', 'Las Vegas NV', 'Leatherhead', 'Macclesfield', 'Marblehead MA', 'McLean VA', 'Memphis TN', 'Midland MI', 'New Orleans LA', 'Ramat Gan', 'Red Bank NJ', 'Richardson TX', 'Rotterdam', 'Salford', 'Scottsdale AZ', 'Short Hills NJ', 'St Louis MO', 'St Paul MN', 'Staines', 'Taipei City', 'The Hague', 'Tokyo', 'Walnut Creek CA', 'Whippany NJ', 'Woodland Hills CA', 'York'
];

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    job_type: '',
    tags: [],
    sort: 'posting_date_desc',
  });
  const [refresh, setRefresh] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        job_type: filters.job_type,
        location: filters.location,
        tag: filters.tags[0], // backend only supports one tag
        sort: filters.sort,
      };
      const res = await getJobs(params);
      let data = res.data;
      // Keyword filter (title/company) and multi-tag filter client-side
      if (filters.keyword) {
        data = data.filter(job =>
          job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.keyword.toLowerCase())
        );
      }
      if (filters.tags.length > 1) {
        data = data.filter(job =>
          filters.tags.every(tag => job.tags.includes(tag))
        );
      }
      setJobs(data);
    } catch (e) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [filters, refresh]);

  const handleFilterChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'tags') {
      setFilters(prev => {
        const tags = prev.tags.includes(value)
          ? prev.tags.filter(t => t !== value)
          : [...prev.tags, value];
        return { ...prev, tags };
      });
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    setFilters({ keyword: '', location: '', job_type: '', tags: [], sort: 'posting_date_desc' });
  };

  const handleDeleted = () => setRefresh(r => !r);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto mt-6 md:mt-10 px-4 md:px-0">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <button
            onClick={toggleMobileFilter}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold flex items-center"
          >
            {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
            onClick={() => navigate('/add')}
          >
            + Post Job
          </button>
        </div>

        {/* Mobile Filter Panel */}
        <div className={`md:hidden mb-6 transition-all duration-300 ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
          <FilterSortJob
            filters={filters}
            onChange={handleFilterChange}
            locations={locationsList}
            jobTypes={jobTypes}
            tags={tagsList}
            onReset={handleReset}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block">
            <FilterSortJob
              filters={filters}
              onChange={handleFilterChange}
              locations={locationsList}
              jobTypes={jobTypes}
              tags={tagsList}
              onReset={handleReset}
            />
          </aside>

          {/* Job List */}
          <section className="lg:col-span-2 space-y-4">
            {/* Desktop Post Job Button */}
            <div className="hidden md:flex justify-end mb-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
                onClick={() => navigate('/add')}
              >
                + Post a Job
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No jobs found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white p-4 md:p-6 rounded-lg shadow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-blue-600 text-base md:text-lg mb-2">{job.title}</h4>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                        <span className="font-semibold">{job.company}</span>
                        {job.location && <span className="bg-gray-200 px-2 py-1 rounded text-xs">{job.location}</span>}
                        {job.job_type && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{job.job_type}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1 md:gap-2 mb-3">
                        {job.tags && job.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">{tag}</span>
                        ))}
                        {job.tags && job.tags.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">+{job.tags.length - 3} more</span>
                        )}
                      </div>
                      {job.salary && <div className="text-gray-500 text-xs mb-2">Salary: {job.salary}</div>}
                      {job.url && (
                        <a href={job.url} target="_blank" rel="noreferrer" className="text-blue-500 underline text-xs">Apply</a>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <span className="text-gray-400 text-xs">Posted: {job.posting_date && new Date(job.posting_date).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          onClick={() => navigate(`/edit/${job.id}`)}
                        >
                          Edit
                        </button>
                        <DeleteJob jobId={job.id} onDeleted={handleDeleted} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
} 