// Sample data for testing VideoCard and VideoGrid components
// You can use this until your API is connected

export const generateSampleVideos = (count = 12) => {
  const thumbnails = [
    "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    "https://i.ytimg.com/vi/yKNxeF4KMsY/maxresdefault.jpg",
    "https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
    "https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg",
    "https://i.ytimg.com/vi/LOZuxwVk7TU/maxresdefault.jpg",
  ];
  
  const userAvatars = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
  ];
  
  const channels = [
    { username: "musicmaster", fullName: "Music Master", isVerified: true },
    { username: "gamingpro", fullName: "Gaming Pro", isVerified: true },
    { username: "techreview", fullName: "Tech Review", isVerified: false },
    { username: "cookingguide", fullName: "Cooking Guide", isVerified: true },
  ];
  
  const videoTitles = [
    "Top 10 Amazing Moments That Will Blow Your Mind",
    "How to Master JavaScript in 30 Days - Complete Tutorial",
    "Epic Fails Compilation - Try Not to Laugh Challenge",
    "DIY Home Renovation Ideas on a Budget",
    "The Most Beautiful Places You Need to Visit in 2025",
    "Relaxing Music for Stress Relief and Better Sleep",
  ];
  
  const randomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  return Array(count).fill().map((_, index) => {
    const randomChannelIndex = Math.floor(Math.random() * channels.length);
    const randomThumbnailIndex = Math.floor(Math.random() * thumbnails.length);
    const randomTitleIndex = Math.floor(Math.random() * videoTitles.length);
    
    return {
      _id: `video-${index}`,
      title: videoTitles[randomTitleIndex] + ` ${index + 1}`,
      description: "This is a sample video description. It contains details about what the video is about.",
      thumbnail: thumbnails[randomThumbnailIndex],
      videoFile: "https://example.com/video.mp4",
      duration: Math.floor(Math.random() * 600) + 120, // 2-12 minutes in seconds
      views: Math.floor(Math.random() * 1000000),
      owner: {
        _id: `user-${randomChannelIndex}`,
        username: channels[randomChannelIndex].username,
        fullName: channels[randomChannelIndex].fullName,
        avatar: userAvatars[randomChannelIndex],
        isVerified: channels[randomChannelIndex].isVerified
      },
      createdAt: randomDate().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
};

export default generateSampleVideos;