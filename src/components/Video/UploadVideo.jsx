import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../constants';
import { FaCloudUploadAlt, FaImage, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const UploadVideo = () => {
  const navigate = useNavigate();
  const videoFileRef = useRef();
  const thumbnailRef = useRef();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  
  // UI state
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    description: '',
    videoFile: '',
    thumbnail: ''
  });

  // Handle video file selection
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setValidationErrors(prev => ({
        ...prev,
        videoFile: 'Video file size should be less than 100MB'
      }));
      return;
    }
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      setValidationErrors(prev => ({
        ...prev,
        videoFile: 'Please select a valid video file (MP4, WebM, Ogg)'
      }));
      return;
    }
    
    // Clear previous errors
    setValidationErrors(prev => ({
      ...prev,
      videoFile: ''
    }));
    
    // Create a preview URL
    const previewURL = URL.createObjectURL(file);
    setVideoPreview(previewURL);
    setVideoFile(file);
  };

  // Handle thumbnail selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setValidationErrors(prev => ({
        ...prev,
        thumbnail: 'Thumbnail size should be less than 2MB'
      }));
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationErrors(prev => ({
        ...prev,
        thumbnail: 'Please select a valid image (JPEG, PNG, WebP)'
      }));
      return;
    }
    
    // Clear previous errors
    setValidationErrors(prev => ({
      ...prev,
      thumbnail: ''
    }));
    
    // Create a preview URL
    const previewURL = URL.createObjectURL(file);
    setThumbnailPreview(previewURL);
    setThumbnail(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    
    // Validate form
    let isValid = true;
    const newValidationErrors = {
      title: '',
      description: '',
      videoFile: '',
      thumbnail: ''
    };
    
    if (!title.trim()) {
      newValidationErrors.title = 'Title is required';
      isValid = false;
    } else if (title.length > 100) {
      newValidationErrors.title = 'Title should be less than 100 characters';
      isValid = false;
    }
    
    if (!description.trim()) {
      newValidationErrors.description = 'Description is required';
      isValid = false;
    } else if (description.length > 5000) {
      newValidationErrors.description = 'Description should be less than 5000 characters';
      isValid = false;
    }
    
    if (!videoFile) {
      newValidationErrors.videoFile = 'Please select a video file';
      isValid = false;
    }
    
    if (!thumbnail) {
      newValidationErrors.thumbnail = 'Please select a thumbnail';
      isValid = false;
    }
    
    setValidationErrors(newValidationErrors);
    
    if (!isValid) return;
    
    // Check if user is authenticated
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('You must be logged in to upload videos');
      navigate('/login');
      return;
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnail);
    
    // Start upload
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const response = await axios.post(`${server}/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      
      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        setSuccess(true);
        // Reset form after successful upload
        setTimeout(() => {
          // Navigate to the uploaded video
          const videoId = response.data.data?._id || response.data.data?.videoId;
          if (videoId) {
            navigate(`/watch/${videoId}`);
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to upload video');
      }
    } catch (err) {
      console.error('Error uploading video:', err);
      setError(err.response?.data?.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove video file
  const removeVideoFile = () => {
    setVideoFile(null);
    setVideoPreview('');
    if (videoFileRef.current) {
      videoFileRef.current.value = '';
    }
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview('');
    if (thumbnailRef.current) {
      thumbnailRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      
      {error && (
        <div className="bg-red-900 text-white p-4 rounded-lg mb-6 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900 text-white p-4 rounded-lg mb-6 flex items-center">
          <FaCheck className="mr-2" />
          <span>Video uploaded successfully! Redirecting...</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Video upload and preview */}
          <div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">
                Video File <span className="text-red-500">*</span>
              </label>
              
              {!videoFile ? (
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#ff3b5c] transition"
                  onClick={() => videoFileRef.current?.click()}
                >
                  <FaCloudUploadAlt className="text-5xl mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-400">Click to select a video file</p>
                  <p className="text-gray-500 text-sm mt-2">MP4, WebM or Ogg (Max: 100MB)</p>
                </div>
              ) : (
                <div className="relative">
                  <video 
                    src={videoPreview} 
                    controls 
                    className="w-full h-48 object-cover rounded-lg bg-black"
                  ></video>
                  <button
                    type="button"
                    onClick={removeVideoFile}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                    title="Remove video"
                  >
                    <FaTimes />
                  </button>
                  <p className="text-gray-400 text-sm mt-1">{videoFile.name}</p>
                </div>
              )}
              
              <input
                type="file"
                ref={videoFileRef}
                onChange={handleVideoFileChange}
                className="hidden"
                accept="video/mp4,video/webm,video/ogg"
              />
              
              {validationErrors.videoFile && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.videoFile}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">
                Thumbnail <span className="text-red-500">*</span>
              </label>
              
              {!thumbnail ? (
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#ff3b5c] transition"
                  onClick={() => thumbnailRef.current?.click()}
                >
                  <FaImage className="text-5xl mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-400">Click to select a thumbnail</p>
                  <p className="text-gray-500 text-sm mt-2">JPEG, PNG or WebP (Max: 2MB)</p>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                    title="Remove thumbnail"
                  >
                    <FaTimes />
                  </button>
                  <p className="text-gray-400 text-sm mt-1">{thumbnail.name}</p>
                </div>
              )}
              
              <input
                type="file"
                ref={thumbnailRef}
                onChange={handleThumbnailChange}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
              />
              
              {validationErrors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.thumbnail}</p>
              )}
            </div>
          </div>
          
          {/* Right column: Video details */}
          <div>
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#ff3b5c]"
                placeholder="Enter a descriptive title"
              />
              {validationErrors.title && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#ff3b5c] min-h-[200px]"
                placeholder="Describe your video"
              ></textarea>
              <p className="text-gray-500 text-xs mt-1">
                {description.length}/5000 characters
              </p>
              {validationErrors.description && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-300">Upload Progress</label>
                <span className="text-gray-300">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-[#ff3b5c] h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-700 rounded-lg mr-4 hover:bg-gray-600 transition"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#ff3b5c] rounded-lg hover:bg-[#e02d53] transition flex items-center"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>Upload Video</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Tips for better uploads */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Tips for Better Uploads</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>Use high-quality video files for the best viewing experience</li>
          <li>Choose a thumbnail that accurately represents your video content</li>
          <li>Write descriptive titles and detailed descriptions to help viewers find your content</li>
          <li>If your upload fails, try using a smaller file or compressing your video</li>
          <li>Ensure you have a stable internet connection during uploads</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadVideo;
