import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '',
});

// Request interceptor: centralize all Bearer token attachment (D-07, DISC-01)
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: D-07 — 401 → clear token + redirect /login (no auto-refresh, AUTHX-01 is v2)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
