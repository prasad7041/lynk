import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";

const Userposts = () => {
  const [posts, setPosts] = useState([]);
  const [visibleComments, setVisibleComments] = useState({}); // Track visible comments per post
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5501/user/userpost",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Error occurred while fetching user posts:", err);
      }
    };

    fetchUserPosts();
  }, [token]);

  const toggleComments = (index) => {
    setVisibleComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (posts.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        You haven't posted anything yet.
      </div>
    );
  }

  return (
    <div className="bg-white w-full flex flex-col items-center">
      {posts.map((post, index) => (
        <div
          key={post._id || index}
          className="w-full max-w-xl border-b border-gray-200"
        >
          <img
            src={post.image}
            alt="User post"
            className="w-full h-[500px] object-cover"
          />

          {/* Post Content */}
          <div className="p-4">
            <p className="text-gray-800 text-sm mb-2">{post.caption}</p>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{post.likes?.length || 0} Likes</span>
              </div>

              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => toggleComments(index)}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comment?.length || 0} Comments</span>
              </div>
            </div>

            {/* Comments Section */}
            {visibleComments[index] && post.comment && post.comment.length > 0 && (
              <div className="mt-4 space-y-2">
                {post.comment.map((com, i) => (
                  <div key={i} className="text-sm text-gray-700">
                    <span className="font-semibold">{com.username}:</span>{" "}
                    {com.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Userposts;
