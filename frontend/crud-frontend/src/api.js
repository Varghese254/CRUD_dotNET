import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5144/api"
});

// Request interceptor to add token and log
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // If 401 Unauthorized, redirect to login
    if (error.response?.status === 401) {
      console.log('Unauthorized! Redirecting to login...');
      localStorage.clear();
      window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  }
);

export default api;