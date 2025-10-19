import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../../constants';
import { useSelector } from 'react-redux';

const AddComment = ({ videoId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: userData } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${server}/comments/${videoId}`, 
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      // Reset form
      setContent('');
      
      // Notify parent component
      if (onCommentAdded && response.data.data) {
        onCommentAdded(response.data.data);
      }
      
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Could not add comment. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      {/* User Avatar */}
      <img
        src={userData?.avatar || 'https://via.placeholder.com/40'}
        alt={userData?.fullName || 'User'}
        className="w-10 h-10 rounded-full object-cover"
      />
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="mb-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-gray-700 focus:border-gray-400 outline-none py-2 px-1"
          />
        </div>
        
        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setContent('')}
            className="px-3 py-1.5 mr-2 text-sm bg-transparent hover:bg-gray-800 rounded-full transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={!content.trim() || isLoading}
            className={`px-3 py-1.5 text-sm ${
              !content.trim() || isLoading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-[#ff3b5c] hover:bg-[#e02d53]'
            } rounded-full transition-colors`}
          >
            {isLoading ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
