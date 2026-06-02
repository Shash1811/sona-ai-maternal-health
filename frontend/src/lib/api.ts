// Central API configuration
// Reads VITE_API_BASE_URL from environment (set in Vercel dashboard for production)
// Falls back to the live Render backend URL so the app works even without the env var
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sona-ai-backend.onrender.com/api';

export default API_BASE_URL;
