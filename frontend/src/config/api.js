// API configuration
// In production, API routes are served from /api on the same domain
const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:8000/api'
);

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

export default apiConfig;
