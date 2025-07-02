// src/api/apiClient.js
import axios from 'axios';
import ENV from "../config/env"; // Import environment variables

const BASE_URL = ENV.API_BASE_URL;

// Regular axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Private axios instance with interceptors for authenticated requests
export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// This will be set by the AuthContext
let authContext = null;

export const setAuthContext = (context) => {
  authContext = context;
};

// Add request interceptor to add Authorization header
privateApi.interceptors.request.use(
  (config) => {
    if (!config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${authContext?.auth?.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 403 (Forbidden) and we haven't tried refreshing yet
    if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const storedAuth = JSON.parse(localStorage.getItem('auth'));
        if (!storedAuth) throw new Error('No refresh token available');
        const { refreshToken } = storedAuth;
        const response = await api.post('/auth/refresh-token', {refreshToken});
        const { accessToken } = response.data;
        localStorage.setItem('auth', JSON.stringify(response.data));

        // Update auth context with new token
        authContext?.setAuth(prev => ({
          ...prev,
          accessToken
        }));

        // Retry the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        
        // If refresh fails, logout the user
        authContext?.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

