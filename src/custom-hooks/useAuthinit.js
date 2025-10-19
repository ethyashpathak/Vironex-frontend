// src/hooks/useAuthInit.js

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { server } from '../constants';
import { login, logout, setTokens } from '../redux/authSlice';

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        dispatch(logout()); // Ensure state is clean if no token
        return;
      }

      try {
        // Validate the token by fetching the user
        const response = await axios.get(`${server}/users/current-user`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.data?.data) {
          // If token is valid, update Redux state with user data
          dispatch(login({ data: response.data.data }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        
        // If the error is 401 Unauthorized, try to refresh the token
        if (error.response?.status === 401) {
          try {
            console.log("Attempting to refresh token on app initialization");
            const refreshResponse = await axios.post(
              `${server}/users/refresh-token`,
              {}, // Empty body since token should be in cookie
              { withCredentials: true }
            );
            
            if (refreshResponse.data.success) {
              const { accessToken, refreshToken } = refreshResponse.data.data;
              
              if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                if (refreshToken) {
                  localStorage.setItem('refreshToken', refreshToken);
                }
                
                // Update Redux with new tokens
                dispatch(setTokens({ 
                  accessToken, 
                  refreshToken: refreshToken || localStorage.getItem('refreshToken')
                }));
                
                // Try fetching user info again with new token
                const userResponse = await axios.get(`${server}/users/current-user`, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  },
                  withCredentials: true
                });
                
                if (userResponse.data?.data) {
                  dispatch(login({ data: userResponse.data.data }));
                  return;
                }
              }
            }
            
            // If we got here, refresh was unsuccessful
            dispatch(logout());
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            dispatch(logout());
          }
        } else {
          // For any other errors, log the user out
          dispatch(logout());
        }
      }
    };

    initializeAuth();
  }, [dispatch]);
};