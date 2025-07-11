import React from 'react';

export default function FilterSortJob({ filters, onChange, locations, jobTypes, tags, onReset }) {
  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Keyword</h3>
        <input
          type="text"
          name="keyword"
          value={filters.keyword || ''}
          onChange={onChange}
          placeholder="Title or Company"
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Location</h3>
        <select
          name="location"
          value={filters.location || ''}
          onChange={onChange}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">All</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Job Type</h3>
        <select
          name="job_type"
          value={filters.job_type || ''}
          onChange={onChange}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">All</option>
          {jobTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <label key={tag} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="tags"
                value={tag}
                checked={filters.tags?.includes(tag) || false}
                onChange={onChange}
              />
              <span className="text-sm">{tag}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Sort By</h3>
        <select
          name="sort"
          value={filters.sort || 'posting_date_desc'}
          onChange={onChange}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="posting_date_desc">Date Posted: Newest First</option>
          <option value="posting_date_asc">Date Posted: Oldest First</option>
        </select>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={onReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
} 