import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8077',  // Verify this is the correct backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error debugging
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', {
      message: error.message,
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Add an interceptor to include auth token if available
instance.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
