// import React, { useState,useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { server } from '../../constants';
// import { FaThumbsUp, FaThumbsDown, FaFlag } from 'react-icons/fa';
// import { axiosAuth } from '../../utils/axiosConfig';
// import { useSelector } from 'react-redux';

// // Simple time ago function
// const timeAgo = (date) => {
//   try {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
//     let interval = seconds / 31536000;
//     if (interval > 1) return Math.floor(interval) + ' years ago';
    
//     interval = seconds / 2592000;
//     if (interval > 1) return Math.floor(interval) + ' months ago';
    
//     interval = seconds / 86400;
//     if (interval > 1) return Math.floor(interval) + ' days ago';
    
//     interval = seconds / 3600;
//     if (interval > 1) return Math.floor(interval) + ' hours ago';
    
//     interval = seconds / 60;
//     if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
//     return Math.floor(seconds) + ' seconds ago';
//   } catch (e) {
//     return 'some time ago';
//   }
// };

// const CommentCard = ({ comment }) => {
//   const navigate = useNavigate();
//   const [isLiked, setIsLiked] = useState(comment.isLiked || false);
//   const [likeCount, setLikeCount] = useState(comment.likes || 0);
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [replyContent, setReplyContent] = useState('');
//   const [replies, setReplies] = useState(comment.replies || []);
//   const [showReplies, setShowReplies] = useState(false);
//   const [profileData, setProfileData] = useState(null);
//   const { status: isLoggedIn, userData } = useSelector(state => state.auth);
  
//   const handleLikeComment = async () => {
//     try {
//       await axiosAuth.post(`${server}/likes/toggle/c/${comment._id}`, {}, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//         }
//       });
      
//       // Toggle like state and update count
//       setIsLiked(prev => !prev);
//       setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
//     } catch (err) {
//       console.error('Error toggling comment like:', err);
//     }
//   };

//   useEffect(() => {
//     console.log('Auth status in AddComment:', { isLoggedIn, userData });
    
//     const fetchUserProfile = async () => {
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         console.warn('No access token found, cannot fetch user profile');
//         return;
//       }
      
//       try {
//         const response = await axios.get(`${server}/users/current-user`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//           withCredentials: true
//         });
        
//         console.log('User profile data response:', response.data);
        
//         if (response.data?.data) {
//           setProfileData(response.data.data);
//         }
//       } catch (err) {
//         console.error('Error fetching user profile:', err);
//       }
//     };
    
//     if (isLoggedIn) {
//       fetchUserProfile();
//     }
//   }, [isLoggedIn]);
  
//   const handleReply = async (e) => {
//     e.preventDefault();
    
//     if (!replyContent.trim()) return;
    
//     try {
//       const response = await axiosAuth.post(`${server}/comments/${comment.video}`, {
//         content: replyContent,
//         parentComment: comment._id
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//         }
//       });
      
//       // Add the new reply to the replies list
//       if (response.data.data) {
//         setReplies(prev => [response.data.data, ...prev]);
//         setReplyContent('');
//         setShowReplyForm(false);
//         setShowReplies(true); // Show replies after adding a new one
//       }
      
//     } catch (err) {
//       console.error('Error adding reply:', err);
//     }
//   };
  
//   // const handleUserClick = () => {
//   //   navigate(`/channel/${comment.owner?.username}`);
//   // };
  
//   return (
//     <div className="mb-6">
//       <div className="flex">
//         {/* User Avatar */}
//         <div 
//           className="mr-3" 
//           //onClick={handleUserClick}
//         >
//           <img
//             src={profileData?.avatar}
//             alt={profileData?.fullName}
//             className="w-10 h-10 rounded-full object-cover cursor-pointer"
//           />
//         </div>
        
//         {/* Comment Content */}
//         <div className="flex-1">
//           {/* User and Time */}
//           <div className="flex items-baseline mb-1">
//             <span 
//               className="font-medium mr-2 cursor-pointer hover:underline"
//               //onClick={handleUserClick}
//             >
//               {comment.owner?.fullName}
//             </span>
//             <span className="text-gray-400 text-xs">
//               {timeAgo(comment.createdAt)}
//             </span>
//           </div>
          
//           {/* Comment Text */}
//           <p className="text-sm text-gray-200 mb-2">
//             {comment.content}
//           </p>
          
//           {/* Actions */}
//           <div className="flex items-center text-sm text-gray-400">
//             <button 
//               className={`flex items-center mr-4 ${isLiked ? 'text-[#ff3b5c]' : ''}`}
//               onClick={handleLikeComment}
//             >
//               <FaThumbsUp className="mr-1" />
//               <span>{likeCount}</span>
//             </button>
            
//             <button className="flex items-center mr-4">
//               <FaThumbsDown className="mr-1" />
//             </button>
            
//             <button 
//               className="mr-4 hover:text-white"
//               onClick={() => setShowReplyForm(!showReplyForm)}
//             >
//               Reply
//             </button>
            
//             <button className="hover:text-white">
//               <FaFlag />
//             </button>
//           </div>
          
//           {/* Reply Form */}
//           {showReplyForm && (
//             <div className="mt-3">
//               <form onSubmit={handleReply} className="flex">
//                 <input
//                   type="text"
//                   value={replyContent}
//                   onChange={(e) => setReplyContent(e.target.value)}
//                   placeholder="Add a reply..."
//                   className="flex-1 bg-transparent border-b border-gray-700 focus:border-gray-400 outline-none py-1 px-1 text-sm"
//                 />
                
//                 <div className="ml-2">
//                   <button
//                     type="button"
//                     onClick={() => setShowReplyForm(false)}
//                     className="px-2 py-1 text-xs bg-transparent hover:bg-gray-800 rounded-full transition-colors mr-2"
//                   >
//                     Cancel
//                   </button>
                  
//                   <button
//                     type="submit"
//                     disabled={!replyContent.trim()}
//                     className={`px-2 py-1 text-xs ${
//                       !replyContent.trim()
//                         ? 'bg-gray-700 cursor-not-allowed'
//                         : 'bg-[#ff3b5c] hover:bg-[#e02d53]'
//                     } rounded-full transition-colors`}
//                   >
//                     Reply
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
          
//           {/* Show Replies Toggle */}
//           {replies.length > 0 && (
//             <button 
//               className="mt-3 text-[#4b96ff] text-sm flex items-center"
//               onClick={() => setShowReplies(!showReplies)}
//             >
//               <span className={`mr-1 ${showReplies ? 'rotate-180' : ''}`}>▼</span>
//               {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
//             </button>
//           )}
          
//           {/* Replies */}
//           {showReplies && replies.length > 0 && (
//             <div className="mt-3 pl-8 border-l border-gray-700">
//               {replies.map(reply => (
//                 <CommentCard key={reply._id} comment={reply} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommentCard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { server } from '../../constants';
import { FaThumbsUp, FaThumbsDown, FaFlag } from 'react-icons/fa';
import { axiosAuth } from '../../utils/axiosConfig';
// import { useSelector } from 'react-redux'; // No longer needed here

// Simple time ago function
const timeAgo = (date) => {
  // ... (your timeAgo function is fine)
  try {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  } catch (e) {
    return 'some time ago';
  }
};

const CommentCard = ({ comment }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplies, setShowReplies] = useState(false);
  
  // REMOVED: profileData state
  // REMOVED: useSelector hook
  // REMOVED: useEffect for fetchUserProfile

  const handleLikeComment = async () => {
    try {
      await axiosAuth.post(`${server}/likes/toggle/c/${comment._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      setIsLiked(prev => !prev);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Error toggling comment like:', err);
    }
  };
  
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    try {
      const response = await axiosAuth.post(`${server}/comments/${comment.video}`, {
        content: replyContent,
        parentComment: comment._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.data.data) {
       // The new reply (response.data.data) should have its own 'owner' object
        setReplies(prev => [response.data.data, ...prev]);
        setReplyContent('');
        setShowReplyForm(false);
        setShowReplies(true);
      }
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };
  
  // UNCOMMENTED: This uses the comment owner's username for navigation
  const handleUserClick = () => {
     navigate(`/channel/${comment.owner?.username}`);
  };
  
  //console.log(comment.ownerDetails);
  
  return (
    <div className="mb-6">
      <div className="flex">
        {/* User Avatar */}
        <div 
          className="mr-3" 
         // onClick={handleUserClick} // UNCOMMENTED
        >
          <img
            // FIXED: Use comment.owner.avatar
            src={comment.ownerDetails?.avatar} 
            // FIXED: Use comment.owner.fullName
            alt={comment.ownerDetails?.fullName} 
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
        </div>
        
        {/* Comment Content */}
        <div className="flex-1">
          {/* User and Time */}
          <div className="flex items-baseline mb-1">
            <span 
              className="font-medium mr-2 cursor-pointer hover:underline"
              onClick={handleUserClick} // UNCOMMENTED
            >
              {/* This was already correct */}
              {comment.owner?.fullName} 
            </span>
            <span className="text-gray-400 text-xs">
              {timeAgo(comment.createdAt)}
            </span>
        _</div>
          
          {/* Comment Text */}
          <p className="text-sm text-gray-200 mb-2">
            {comment.content}
          </p>
          
          {/* ... (rest of your component is fine) ... */}
          {/* Actions */}
          <div className="flex items-center text-sm text-gray-400">
            <button 
              className={`flex items-center mr-4 ${isLiked ? 'text-[#ff3b5c]' : ''}`}
              onClick={handleLikeComment}
            >
              <FaThumbsUp className="mr-1" />
              <span>{likeCount}</span>
            </button>
            
            <button className="flex items-center mr-4">
              <FaThumbsDown className="mr-1" />
            </button>
            
            <button 
              className="mr-4 hover:text-white"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </button>
            
            <button className="hover:text-white">
              <FaFlag />
            </button>
          </div>
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3">
              <form onSubmit={handleReply} className="flex">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Add a reply..."
                  className="flex-1 bg-transparent border-b border-gray-700 focus:border-gray-400 outline-none py-1 px-1 text-sm"
	            />
                
                <div className="ml-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-2 py-1 text-xs bg-transparent hover:bg-gray-800 rounded-full transition-colors mr-2"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
  D                   disabled={!replyContent.trim()}
                    className={`px-2 py-1 text-xs ${
                      !replyContent.trim()
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-[#ff3b5c] hover:bg-[#e02d53]'
                    } rounded-full transition-colors`}
                  >
                    Reply
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Show Replies Toggle */}
          {replies.length > 0 && (
            <button 
              className="mt-3 text-[#4b96ff] text-sm flex items-center"
              onClick={() => setShowReplies(!showReplies)}
            >
              <span className={`mr-1 ${showReplies ? 'rotate-180' : ''}`}>▼</span>
              {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
          
          {/* Replies */}
          {showReplies && replies.length > 0 && (
            <div className="mt-3 pl-8 border-l border-gray-700">
              {replies.map(reply => (
                // This recursion is correct. The 'reply' object will be 
                // passed as the 'comment' prop to the new CommentCard.
                <CommentCard key={reply._id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
