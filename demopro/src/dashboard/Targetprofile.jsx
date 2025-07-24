import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PostViewer from "./PostViewer";

function TargetProfile() {
  const { targetname } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [username, setUsername] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "https://lynk-backend-bmv8.onrender.com/user/targetprofile",
          { username: targetname },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { targetaccount, targetposts, username } = res.data;
        setUserProfile(targetaccount[0]);
        setUserPosts(targetposts);
        setUsername(username);

        // Check if current user follows target
        const isFollowing = targetaccount[0]?.followers?.includes(username);
        setIsFollowing(isFollowing);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };

    fetchData();
  }, [targetname, token]); // Added token to dependencies

  const handleFollowToggle = async () => {
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await axios.post(
        `https://lynk-backend-bmv8.onrender.com/user/${endpoint}`,
        { targetname: userProfile.username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserProfile((prev) => ({
        ...prev,
        followers: res.data.updatedFollowers,
      }));

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
      alert(
        err.response?.data?.message || "Failed to update follow status. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading profile...
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Profile not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
        <img
          src={userProfile.profilepic || "/default-profile.png"}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border border-gray-300"
          onError={(e) => {
            e.target.src = "/default-profile.png";
          }}
        />
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-2xl font-semibold">{userProfile.username}</h2>
          <div className="flex gap-6 mt-2 text-sm">
            <span>
              <strong>{userPosts.length}</strong> posts
            </span>
            <span>
              <strong>{userProfile.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{userProfile.following?.length || 0}</strong> following
            </span>
          </div>

          {/* Follow/Unfollow Button */}
          {userProfile.username !== username && (
            <button
              onClick={handleFollowToggle}
              className={`mt-3 px-4 py-1 text-sm rounded-full transition duration-300 ${
                isFollowing
                  ? "bg-white border border-gray-400 text-black hover:bg-gray-100 hover:border-gray-500"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}

          <p className="mt-2 text-gray-600">
            {userProfile.bio || "No bio available."}
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {userPosts.map((post, index) => (
          <div
            key={post._id || index}
            className="aspect-square overflow-hidden cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <img
              src={post.image}
              alt="user-post"
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onError={(e) => {
                e.target.src = "/default-post.png";
              }}
            />
          </div>
        ))}
      </div>

      {/* Post Viewer Modal */}
      {selectedPost && (
        <PostViewer
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          currentUser={username}
          token={token}
          profilepic={userProfile.profilepic}
        />
      )}
    </div>
  );
}

export default TargetProfile;
