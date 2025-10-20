import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosAuth } from '../../utils/axiosConfig';
import { refreshAccessToken, isTokenExpired } from '../../utils/tokenUtils';
import { server } from '../../constants';
import VideoCard from './VideoCard';

const VideoGrid = ({ title, endpoint, params = {}, limit = 12 }) => {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
const serializedParams = JSON.stringify(params);
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError('');
      
      // Check if we have a token
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.warn("No access token found in localStorage!");
        setError('Authentication required. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      // Check if token is expired and refresh if needed
      if (isTokenExpired()) {
        console.log("Token is expired or about to expire, refreshing...");
        const refreshSuccess = await refreshAccessToken();
        if (!refreshSuccess) {
          console.error("Token refresh failed and no valid token is available");
          setError('Your session has expired. Please log in again.');
          setIsLoading(false);
          return;
        }
      }
      
      try {
        const queryParams = new URLSearchParams({
          ...params,
          limit,
          page: 1,
          sortBy: params.sortBy || 'createdAt',
          sortType: params.sortType || 'desc'
        }).toString();
        
        console.log(`Making request to: ${endpoint}?${queryParams}`);
        console.log(`With auth token: Bearer ${accessToken.substring(0, 15)}...`);
        
        // Always get a fresh axios instance with the latest token
        let response;
        try {
          // Get a fresh axios instance with the current token
          const freshAxiosAuth = axiosAuth();
          
          // Use the fresh instance for the request
          response = await freshAxiosAuth.get(`${endpoint}`, {
            params: { ...params, limit, page: 1, sortBy: params.sortBy || 'createdAt', sortType: params.sortType || 'desc' },
          });
          console.log("Request successful using fresh axiosAuth instance");
        } catch (authError) {
          console.warn("axiosAuth request failed, falling back to manual token handling", authError);
          
          // Fallback to direct axios with manual token if axiosAuth fails
          response = await axios.get(`${server}${endpoint}?${queryParams}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true // Enable cookies for potential refresh token
          });
        }
        
        console.log("API Response:", response.data);
        

        const responseData = response.data.data;
        setVideos(responseData.videos || []);
        setPagination(responseData.pagination || {});
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching videos:', err);
        
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          
          if (err.response.status === 401) {
            console.log("Handling 401 error - attempting to refresh token");
            
            // Use our dedicated token refresh utility
            const refreshSuccess = await refreshAccessToken();
            
            if (refreshSuccess) {
              console.log("Token refreshed successfully, retrying request");
              // Retry the original request with the new token
              fetchVideos(); // Call this function again to retry
              return;
            } else {
              console.error("Token refresh failed");
              setError('Your session has expired. Please log in again.');
            }
          } else if (err.response.status === 403) {
            setError('You do not have permission to access these videos.');
          } else {
            setError(`Error: ${err.response.data?.message || 'Could not load videos. Please try again later.'}`);
          }
        } else if (err.request) {

          console.error('Request made but no response received:', err.request);
          setError('Network error. Please check your connection and try again.');
        } else {

          console.error('Error setting up request:', err.message);
          setError('An unexpected error occurred. Please try again later.');
        }
        
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [endpoint, limit, serializedParams]);

  return (
    <div className="mb-8">

      {title && (
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      )}
      

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff3b5c]"></div>
        </div>
      )}
      

      {error && (
        <div className="text-red-500 text-center py-8">
          {error}
        </div>
      )}
      

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.length > 0 ? (
            videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <div className="text-gray-500 col-span-full text-center py-8">
              No videos found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
