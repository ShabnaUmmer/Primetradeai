import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Add request interceptor to include token in all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default API;
