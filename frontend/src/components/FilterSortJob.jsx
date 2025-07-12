import React from 'react';

export default function FilterSortJob({ filters, onChange, locations, jobTypes, tags, onReset }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4 md:space-y-6">
      <div>
        <h3 className="font-semibold text-base md:text-lg mb-2">Keyword</h3>
        <input
          type="text"
          name="keyword"
          value={filters.keyword || ''}
          onChange={onChange}
          placeholder="Title or Company"
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <h3 className="font-semibold text-base md:text-lg mb-2">Location</h3>
        <select
          name="location"
          value={filters.location || ''}
          onChange={onChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      
      <div>
        <h3 className="font-semibold text-base md:text-lg mb-2">Job Type</h3>
        <select
          name="job_type"
          value={filters.job_type || ''}
          onChange={onChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          {jobTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div>
        <h3 className="font-semibold text-base md:text-lg mb-3">Tags</h3>
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tags.map(tag => (
              <label key={tag} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  checked={filters.tags?.includes(tag) || false}
                  onChange={onChange}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-base md:text-lg mb-2">Sort By</h3>
        <select
          name="sort"
          value={filters.sort || 'posting_date_desc'}
          onChange={onChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="posting_date_desc">Date Posted: Newest First</option>
          <option value="posting_date_asc">Date Posted: Oldest First</option>
        </select>
      </div>
      
      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
} 