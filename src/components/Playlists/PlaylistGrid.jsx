import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../../constants';
import PlayListCard from './PlayListCard';
import { axiosAuth } from '../../utils/axiosConfig';

const PlaylistGrid = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Get the current user ID first
        const userResponse = await axiosAuth.get(`${server}/users/current-user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        const userId = userResponse.data.data._id;
        
        // Then fetch the user's playlists
        const response = await axiosAuth.get(`${server}/playlists/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        setPlaylists(response.data.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError('Could not load playlists. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchPlaylists();
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Playlists</h1>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff3b5c]"></div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center py-8">
          {error}
        </div>
      )}
      
      {/* Playlists Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.length > 0 ? (
            playlists.map(playlist => (
              <PlayListCard key={playlist._id} playlist={playlist} />
            ))
          ) : (
            <div className="text-gray-500 col-span-full text-center py-8">
              No playlists found. Create your first playlist!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistGrid;
