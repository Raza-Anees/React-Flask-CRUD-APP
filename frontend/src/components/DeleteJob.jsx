import React, { useState } from 'react';
import { deleteJob } from '../api';

export default function DeleteJob({ jobId, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteJob(jobId);
      if (onDeleted) onDeleted();
    } catch (err) {
      setError('Failed to delete job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </>
  );
} 