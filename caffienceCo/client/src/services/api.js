import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let csrfToken = null;

export const readCsrfFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const setCsrfToken = (token) => {
  csrfToken = token;
};

export const getCsrfToken = () => csrfToken || readCsrfFromCookie();

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const token = getCsrfToken();
  if (token && ['post', 'put', 'patch', 'delete'].includes(method)) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

export default api;