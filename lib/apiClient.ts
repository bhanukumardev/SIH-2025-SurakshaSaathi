import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',
  // other axios config if needed
});

// Add a request interceptor to append region query param and auth token
apiClient.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const region = localStorage.getItem('userRegion') || 'national';
  if (config.method === 'get') {
    if (!config.params) {
      config.params = {};
    }
    config.params.region = region;
  } else if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
    if (config.data && typeof config.data === 'object') {
      config.data.region = region;
    } else {
      config.data = { region };
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
