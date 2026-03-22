export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
export const POTHOLE_API_URL = import.meta.env.VITE_POTHOLE_API_URL || 'http://localhost:8000';
export const FLASK_API_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5005';
export const WATER_API_URL = import.meta.env.VITE_WATER_API_URL || 'http://localhost:5001'; // Defaulting to main backend if shared

export default API_BASE_URL;
