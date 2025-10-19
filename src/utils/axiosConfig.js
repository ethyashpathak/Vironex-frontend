import axios from 'axios';
import {server} from '../constants';

// Create an axios instance with default authorization header
export const createAuthenticatedAxiosInstance = () => {
  const accessToken = localStorage.getItem('accessToken');
  
  const instance = axios.create({
    baseURL: server,
    withCredentials: true, // Allow cookies to be sent and received
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    }
  });
  
  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 Unauthorized and we haven't tried to refresh token yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try refreshing the token using cookies (withCredentials)
          // First attempt with cookie-based auth
          const response = await axios.post(
            `${server}/users/refresh-token`,
            {}, // Empty body since token should be in cookie
            { withCredentials: true }
          );
          
          // If backend returns tokens in response body, store them
          const { accessToken, refreshToken } = response.data.data || {};
          
          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            // Update the authorization header for the retry
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh token fails, clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  return instance;
};

// Create a getter function that always returns a fresh instance with the latest token
let axiosAuthInstance = null;

export const getAxiosAuth = () => {
  // Always create a new instance to ensure it has the latest token
  return createAuthenticatedAxiosInstance();
};

// For backward compatibility - this will be a singleton instance
// But new code should use getAxiosAuth() to always get a fresh instance with the latest token
export const axiosAuth = createAuthenticatedAxiosInstance();