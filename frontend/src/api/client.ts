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
// Auth endpoints are exempted: SimpleJWT returns 401 for bad credentials, so a
// failed login must surface the error to the thunk rather than reloading the page
// (which would tear down the store before login.rejected can render a message).
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? '';
    const isAuthEndpoint = url.includes('/api/token/') || url.includes('/api/register/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
