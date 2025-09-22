// Central place for the Flask backend base URL.
// Use the FLASK_BASE_URL environment variable to override (useful for local dev).
export const FLASK_BASE = process.env.FLASK_BASE_URL || 'https://chatbot-j5aa.onrender.com';
