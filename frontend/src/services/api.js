import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
export const API_URL = rawApiUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
