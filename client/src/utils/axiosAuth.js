import axios from 'axios';
// Default config options
// https://parsitycohort5agile-trello-production.up.railway.app/
const defaultOptions = {
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create instance
export const axiosAuth = axios.create(defaultOptions);

// Set the AUTH token for any request
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});
