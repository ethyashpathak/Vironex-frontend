import React from 'react';

const ChannelCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="h-24 bg-gray-700"></div>
      
      <div className="p-4 flex">
        <div className="mr-4">
          <div className="w-12 h-12 rounded-full bg-gray-700"></div>
        </div>
        
        <div className="w-full">
          <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default ChannelCardSkeleton;