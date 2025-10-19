import React, { useEffect, useState } from 'react';
import VideoGrid from '../Video/VideoGrid';
import { debugAuthToken } from '../../utils/authUtils';
import axios from 'axios';
import { server } from '../../constants';

const HomePage = () => {
  const [authStatus, setAuthStatus] = useState(null);
  
  useEffect(() => {
    // Run token debug on component mount
    debugAuthToken();
    
    // Test authentication status
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setAuthStatus({
            status: 'error',
            message: 'No token found in localStorage'
          });
          return;
        }
        
        // Attempt to access a protected endpoint
        const response = await axios.get(`${server}/users/current-user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setAuthStatus({
          status: 'success',
          message: 'Authentication successful',
          user: response.data?.data
        });
        
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthStatus({
          status: 'error',
          message: error.response?.data?.message || 'Authentication failed',
          error: error.response?.status
        });
      }
    };
    
    checkAuthStatus();
  }, []);
  
  return (
    <div className="px-4 py-6">
      
      
      {/* Trending Videos - Based on views as per controller */}
      <VideoGrid 
        title="Trending Videos" 
        endpoint="/videos" 
        params={{ 
          sortBy: 'views', 
          sortType: 'desc' 
        }} 
        limit={8} 
      />
      
      {/* Recent Uploads - Based on creation date as per controller */}
      <VideoGrid 
        title="Recent Uploads" 
        endpoint="/videos" 
        params={{ 
          sortBy: 'createdAt', 
          sortType: 'desc' 
        }} 
        limit={8} 
      />
      
      {/* You might also like - We don't have specific recommended filter in controller */}
      {/* Using a mix of views and recency as a substitute */}
      <VideoGrid 
        title="Recommended for You" 
        endpoint="/videos" 
        params={{ 
          sortBy: 'views',
          sortType: 'desc'
          // The controller doesn't have a 'recommended' parameter 
          // but we could add user-specific logic in the future
        }} 
        limit={8} 
      />
    </div>
  );
};

export default HomePage;
