import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const getJobs = (params = {}) => axios.get(`${API_BASE}/jobs`, { params });
export const getJob = (id) => axios.get(`${API_BASE}/jobs/${id}`);
export const addJob = (data) => axios.post(`${API_BASE}/jobs`, data);
export const editJob = (id, data) => axios.put(`${API_BASE}/jobs/${id}`, data);
export const deleteJob = (id) => axios.delete(`${API_BASE}/jobs/${id}`); 