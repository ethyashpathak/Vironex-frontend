import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlayListCard = ({ playlist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${playlist._id}`);
  };

  // Get thumbnail from first video or use placeholder
  const getThumbnail = () => {
    if (playlist.videos && playlist.videos.length > 0 && playlist.videos[0].thumbnail) {
      return playlist.videos[0].thumbnail;
    }
    // Placeholder image - replace with your own placeholder image URL
    return 'https://via.placeholder.com/480x270?text=No+Videos';
  };

  // Get video count
  const getVideoCount = () => {
    const count = playlist.videos?.length || 0;
    return `${count} ${count === 1 ? 'video' : 'videos'}`;
  };

  return (
    <div 
      className="cursor-pointer rounded-xl overflow-hidden bg-[#1f1f1f] hover:bg-[#2d2d2d] transition-colors"
      onClick={handleClick}
    >
      {/* Playlist Thumbnail */}
      <div className="relative">
        <img
          src={getThumbnail()}
          alt={playlist.name}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl font-bold">{getVideoCount()}</div>
            <div className="text-sm opacity-80">VIEW ALL</div>
          </div>
        </div>
      </div>
      
      {/* Playlist Info */}
      <div className="p-3">
        <h3 className="text-white text-base font-medium line-clamp-1">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {playlist.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayListCard;
