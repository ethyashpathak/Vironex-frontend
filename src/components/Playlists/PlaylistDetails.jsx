import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosAuth } from "../../utils/axiosConfig";
import { server } from "../../constants";
import { useNavigate } from "react-router-dom";


const PlaylistDetails = () => {
  const navigate = useNavigate();

  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        // 1️⃣ Fetch playlist by ID
        const playlistRes = await axiosAuth.get(
          `${server}/playlist/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const playlistData = playlistRes.data.data;
        setPlaylist(playlistData);

        // 2️⃣ If playlist has video IDs → fetch those videos
        if (playlistData.videos && playlistData.videos.length > 0) {
          const allVideos = [];

          for (const vid of playlistData.videos) {
            const videoRes = await axiosAuth.get(`${server}/videos/${vid}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            });

            allVideos.push(videoRes.data.data);
          }

          setVideos(allVideos);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unable to load playlist.");
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId]);

  return (
    <div className="px-6 py-8">
      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-[#ff3b5c]" />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-400 text-center text-lg py-8">{error}</div>
      )}

      {/* CONTENT */}
      {!loading && playlist && (
        <>
          <h1 className="text-3xl font-bold text-white">{playlist.name}</h1>
          <p className="text-gray-400 mt-1 mb-6">{playlist.description}</p>

          <h2 className="text-2xl font-semibold text-white mb-4">Videos</h2>

          {videos.length === 0 ? (
            <p className="text-gray-400">No videos found in this playlist.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  onClick={()=>navigate(`/watch/${video._id}`)}
                  key={video._id}
                  className="rounded-xl overflow-hidden bg-[#1f1f1f] hover:bg-[#292929] transition cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full aspect-video object-cover"
                  />

                  <div className="p-3">
                    <h3 className="text-white font-medium line-clamp-1">
                      {video.title}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistDetails;
