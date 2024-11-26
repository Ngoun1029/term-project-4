// src/utils/axios.js
import axios from 'axios';

// Use the BASE_URL from the environment variables
const url = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,  // Access the base URL from the .env file
  timeout: 10000,                          // Optional: Set timeout to 10 seconds
 
});

// Add request interceptor to include tokens or modify requests globally
url.interceptors.request.use(
  (config) => {
    // Example: Add token to every request if available
    const token = localStorage.getItem('authToken'); // Or get from any other storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
url.interceptors.response.use(
  (response) => {
    // You can add response transformations or logging here if needed
    return response;
  },
  (error) => {
    // Global error handling (e.g., logging out on 401, or showing error messages)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error, maybe log out or redirect
      console.log('Unauthorized, please login again.');
    } else if (error.response && error.response.status === 500) {
      console.log('Server error, please try again later.');
    } else {
      console.log('An error occurred:', error.message);
    }
    return Promise.reject(error);
  }
);

export default url;
