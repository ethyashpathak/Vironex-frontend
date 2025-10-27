import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosAuth} from '../../utils/axiosConfig';
import { server } from '../../constants';
import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';

const AddComment = ({ videoId, onCommentAdded }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const { status: isLoggedIn, userData } = useSelector(state => state.auth);

  // Fetch user profile data when component mounts
  useEffect(() => {
    //console.log('Auth status in AddComment:', { isLoggedIn, userData });
    
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('No access token found, cannot fetch user profile');
        return;
      }
      
      try {
        const response = await axios.get(`${server}/users/current-user`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        
        //console.log('User profile data response:', response.data);
        
        if (response.data?.data) {
          setProfileData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    // Check for login status
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Get a fresh axios instance with current token
      
      
      const response = await axiosAuth.post(`/comments/${videoId}`, { content });
      
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
      {isLoggedIn ? (
        <img
          src={profileData?.avatar || userData?.avatar || 'https://via.placeholder.com/40?text=User'}
          alt={(profileData?.fullName || userData?.fullName || 'User')}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/40?text=User';
          }}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
          <FaUserCircle size={24} />
        </div>
      )}
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="mb-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isLoggedIn ? "Add a comment..." : "Login to add a comment..."}
            disabled={!isLoggedIn}
            className={`w-full bg-transparent border-b border-gray-700 focus:border-gray-400 outline-none py-2 px-1 ${!isLoggedIn ? 'cursor-not-allowed text-gray-500' : ''}`}
            onClick={!isLoggedIn ? () => navigate('/login') : undefined}
          />
        </div>
        
        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 text-sm bg-[#ff3b5c] hover:bg-[#e02d53] rounded-full transition-colors"
            >
              Login to Comment
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddComment;
