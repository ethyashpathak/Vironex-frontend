// src/hooks/useChannelData.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../constants';

export const useChannelData = (username) => {
  const [channelData, setChannelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Safeguard: If username is not available, don't try to fetch.
    if (!username) {
      setError('Username not found in the URL.');
      setIsLoading(false);
      return;
    }

    const fetchChannel = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Log the request URL and authorization header
       // console.log(`Fetching channel data for: ${username}`);
        //console.log(`API URL: ${server}/users/channel/${username}`);
        
        const token = localStorage.getItem('accessToken');
        //console.log(`Token available: ${!!token}`);
        
        const response = await axios.get(`${server}/users/channel/${username}`, {
          headers: {
            // Note: Authorization is only needed to check the 'isSubscribed' status
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
        
        //console.log('Channel data response:', response.data);
        setChannelData(response.data.data);
      } catch (err) {
        // console.error('Error fetching channel data:', err);
        // console.error('Request details:', {
        //   url: `${server}/users/channel/${username}`,
        //   status: err.response?.status,
        //   statusText: err.response?.statusText,
        //   responseData: err.response?.data
        // });
        setError(err.response?.data?.message || 'Could not load channel information.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannel();
  }, [username]); // This effect re-runs only when the username in the URL changes

  return { channelData, isLoading, error };
};