// Central API configuration — reads from environment in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sona-ai-backend.onrender.com/api';

export default API_BASE_URL;
