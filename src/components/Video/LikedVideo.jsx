import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../../constants';
import VideoGrid from './VideoGrid';
import VideoCard from './VideoCard';

const LikedVideo = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLikedVideos = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${server}/likes/videos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        setLikedVideos(response.data.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching liked videos:', err);
        setError('Could not load liked videos. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchLikedVideos();
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
      

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
          {likedVideos.length > 0 ? (
            likedVideos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <div className="text-gray-500 col-span-full text-center py-8">
              No liked videos yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LikedVideo;
