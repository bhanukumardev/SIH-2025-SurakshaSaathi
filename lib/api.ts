import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string; school?: string; class?: string; region?: string; language?: string }) =>
    api.post('/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/login', data),

  getProfile: () =>
    api.get('/profile'),

  resetPassword: (data: { email: string }) =>
    api.post('/reset-password', data),

  logout: () =>
    api.get('/logout'),
};

export default api;
