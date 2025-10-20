// import axios from 'axios';
// import {server} from '../constants';

// // Create an axios instance with default authorization header
// export const createAuthenticatedAxiosInstance = () => {
//   const accessToken = localStorage.getItem('accessToken');
  
//   const instance = axios.create({
//     baseURL: server,
//     withCredentials: true, // Allow cookies to be sent and received
//     headers: {
//       'Content-Type': 'application/json',
//       ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
//     }
//   });
  
//   // Add response interceptor for error handling
//   instance.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async (error) => {
//       const originalRequest = error.config;
      
//       // If error is 401 Unauthorized and we haven't tried to refresh token yet
//       if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
        
//         try {
//           // Try refreshing the token using cookies (withCredentials)
//           // First attempt with cookie-based auth
//           const response = await axios.post(
//             `${server}/users/refresh-token`,
//             {}, // Empty body since token should be in cookie
//             { withCredentials: true }
//           );
          
//           // If backend returns tokens in response body, store them
//           const { accessToken, refreshToken } = response.data.data || {};
          
//           if (accessToken) {
//             localStorage.setItem('accessToken', accessToken);
//             // Update the authorization header for the retry
//             originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           }
          
//           if (refreshToken) {
//             localStorage.setItem('refreshToken', refreshToken);
//           }
          
//           return axios(originalRequest);
//         } catch (refreshError) {
//           // If refresh token fails, clear tokens and redirect to login
//           localStorage.removeItem('accessToken');
//           localStorage.removeItem('refreshToken');
//           window.location.href = '/login';
//           return Promise.reject(refreshError);
//         }
//       }
      
//       return Promise.reject(error);
//     }
//   );
  
//   return instance;
// };

// // Create a getter function that always returns a fresh instance with the latest token
// let axiosAuthInstance = null;

// export const getAxiosAuth = () => {
//   // Always create a new instance to ensure it has the latest token
//   return createAuthenticatedAxiosInstance();
// };

// // For backward compatibility - this will be a singleton instance
// // But new code should use getAxiosAuth() to always get a fresh instance with the latest token
// export const axiosAuth = createAuthenticatedAxiosInstance();


import axios from 'axios';
import { server } from '../constants';

// Create one single, reusable instance for authenticated requests
export const axiosAuth = axios.create({
    baseURL: server,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * Request Interceptor
 * * This runs *before* every request is sent using `axiosAuth`.
 * Its job is to grab the latest token from localStorage and
 * add it to the Authorization header.
 */
axiosAuth.interceptors.request.use(
    (config) => {
        // Get the latest token from localStorage
        const accessToken = localStorage.getItem('accessToken');
        
        // If the token exists, add it to the header
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * * This runs *after* a response is received.
 * Its job is to check for "401 Unauthorized" errors,
 * attempt to refresh the token, and then retry the original request.
 */
axiosAuth.interceptors.response.use(
    (response) => {
        // Any status code within 2xx range, just return the response
        return response;
    },
    async (error) => {
        // Get the original request that failed
        const originalRequest = error.config;
        
        // Check if it's a 401 error and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as "retried"
            
            try {
                // Attempt to refresh the token.
                // We use a base 'axios' call to avoid an infinite interceptor loop.
                const response = await axios.post(
                    `${server}/users/refresh-token`,
                    {}, // Empty body, token is in the httpOnly cookie
                    { withCredentials: true }
                );
                
                const { accessToken } = response.data.data || {};
                
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                }
                
                // The request interceptor will automatically add the new token
                // when we retry the original request.
                return axiosAuth(originalRequest); 

            } catch (refreshError) {
                // If refreshing the token fails, log the user out.
                console.error("Token refresh failed, logging out:", refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                // Redirect to login page
                // Use window.location.href to force a full page reload 
                // and clear all component state.
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            }
        }
        
        // For any other errors, just reject the promise
        return Promise.reject(error);
    }
);