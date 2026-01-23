// API configuration
// In production, API routes are served from /api on the same domain
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  // In development, use port 8000 on the same host
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  return `${protocol}//${host}:8000/api`;
};

const API_BASE_URL = getApiBaseUrl();

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

export default apiConfig;
