import axios from 'axios';
import { server } from '../constants';
import { store } from '../redux/store';
import { setTokens, logout } from '../redux/authSlice';

/**
 * Utility function to refresh the access token
 * This can be called directly when needed from any component
 * @returns {Promise<boolean>} True if token refresh was successful, false otherwise
 */
export const refreshAccessToken = async () => {
  try {
    console.log("Attempting to refresh access token...");
    
    // Call the refresh token endpoint
    const refreshResponse = await axios.post(
      `${server}/users/refresh-token`,
      {}, // Empty body since token should be in cookie
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (refreshResponse.data.success) {
      const { accessToken, refreshToken } = refreshResponse.data.data;
      
      if (accessToken) {
        console.log("Token refreshed successfully");
        
        // Update tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        // Update Redux state
        store.dispatch(setTokens({ 
          accessToken, 
          refreshToken: refreshToken || localStorage.getItem('refreshToken')
        }));
        
        return true;
      }
    }
    
    // If we get here, the refresh wasn't successful
    console.warn("Token refresh failed - no valid token in response");
    return false;
  } catch (error) {
    console.error("Token refresh error:", error);
    
    // If refresh fails with 401/403, token is invalid or expired completely
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth state
      store.dispatch(logout());
    }
    
    return false;
  }
};

/**
 * Check if the current access token is expired or close to expiration
 * @returns {boolean} True if token needs refresh, false otherwise
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return true;
  }
  
  try {
    // JWT tokens are in format: header.payload.signature
    // We need the payload to check expiration
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    // Check if token is expired or will expire in the next minute
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 60; // 1 minute buffer
    
    return decodedPayload.exp < (currentTime + bufferTime);
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // If we can't check, assume it's expired to be safe
  }
};