import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Home,
  Search,
  PlusSquare,
  User,
} from "lucide-react";

function Dhome() {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [followedUsers, setFollowedUsers] = useState([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'following'
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLike = async (postId) => {
    try {
      await axios.post(
        "http://localhost:5501/user/handlelikes",
        { targetid: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes?.includes(user)
                  ? post.likes.filter((u) => u !== user)
                  : [...(post.likes || []), user],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Like/unlike failed:", error);
    }
  };

  const handlesaved = async (postid) => {
    try {
      await axios.post(
        "http://localhost:5501/user/saved",
        { targetid: postid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllPosts((prev) =>
        prev.map((post) =>
          post.id === postid ? { ...post, saved: !post.saved } : post
        )
      );
    } catch (err) {
      console.error("Error in saving post:", err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post(
        "http://localhost:5501/user/comment",
        { postid: postId, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: data.post.comment || [] }
            : post
        )
      );

      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleFollow = async (username) => {
    try {
      await axios.post(
        "http://localhost:5501/user/follow",
        { targetname: username },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFollowedUsers((prev) => [...prev, username]);
      // Update posts to reflect the follow status
      setAllPosts((prev) =>
        prev.map((post) =>
          post.imageuser === username
            ? {
                ...post,
                followers: [...(post.followers || []), user],
              }
            : post
        )
      );
    } catch (err) {
      alert("You can't follow yourself");
    }
  };

  const handleUnfollow = async (username) => {
    try {
      await axios.post(
        "http://localhost:5501/user/unfollow",
        { targetname: username },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFollowedUsers((prev) => prev.filter((u) => u !== username));
      // Update posts to reflect the unfollow status
      setAllPosts((prev) =>
        prev.map((post) =>
          post.imageuser === username
            ? {
                ...post,
                followers: post.followers?.filter((u) => u !== user),
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5501/user/getpost", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalizedPosts = data.posts.map((post) => ({
          ...post,
          id: post.id,
          likes: post.likes || [],
          comments: post.comments || post.comment || [],
          followers: post.followers || [],
        }));

        setAllPosts(normalizedPosts);
        setUser(data.user);
        setFollowedUsers(data.userfollowing || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (activeTab === "following") {
      setFilteredPosts(
        allPosts.filter((post) => followedUsers.includes(post.imageuser))
      );
    } else {
      setFilteredPosts(allPosts);
    }
  }, [activeTab, allPosts, followedUsers]);

  const toggleComments = (postId) => {
    setActiveCommentPostId((prev) => (prev === postId ? null : postId));
  };

  return (
    <div className="max-w-lg mx-auto bg-white min-h-screen">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex justify-center">
          <div className="flex w-full max-w-md">
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "all"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "following"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="pt-16 flex justify-center">
          <div className="w-full space-y-8 px-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100"></div>
                  <div className="h-4 w-32 bg-blue-100 rounded"></div>
                </div>

                {/* Image Box */}
                <div className="w-full aspect-square bg-blue-100 rounded-lg"></div>

                {/* Icons Row */}
                <div className="flex space-x-4 mt-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
                  <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
                  <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
                </div>

                {/* Likes and caption */}
                <div className="h-4 w-24 bg-blue-100 rounded"></div>
                <div className="h-4 w-40 bg-blue-100 rounded"></div>
                <div className="h-4 w-32 bg-blue-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="pt-16 flex flex-col items-center justify-center h-screen">
          <div className="w-24 h-24 border-2 border-blue-200 rounded-full flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {activeTab === "following" ? "No Posts From Following" : "No Posts Yet"}
          </h3>
          <p className="text-gray-500 text-center max-w-xs">
            {activeTab === "following"
              ? "When people you follow share photos, they'll appear here."
              : "There are no posts to show."}
          </p>
          {activeTab === "all" && (
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
              onClick={() => navigate("/dashboard/addpost")}
            >
              Share Your First Photo
            </button>
          )}
        </div>
      ) : (
        <main className="pb-16">
          {filteredPosts.map((post) => (
            <article key={post.id} className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full border border-blue-100 overflow-hidden">
                    {post.profilepic ? (
                      <img
                        src={post.profilepic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-sm">
                    @{post.imageuser || "username"}
                  </span>
                </div>

                {post.imageuser !== user && (
                  followedUsers.includes(post.imageuser) ? (
                    <button
                      onClick={() => handleUnfollow(post.imageuser)}
                      className="px-3 py-1 text-xs font-medium rounded-full transition bg-white text-red-600 border border-red-600 hover:bg-red-50"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(post.imageuser)}
                      className="px-3 py-1 text-xs font-medium rounded-full transition bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Follow
                    </button>
                  )
                )}
              </div>

              <div
                className="aspect-square bg-gray-100"
                onDoubleClick={() => handleLike(post.id)}
              >
                <img
                  src={post.image}
                  className="w-full h-full object-cover"
                  alt="Post"
                />
              </div>

              <div className="px-4 py-3">
                <div className="flex justify-between mb-2">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`transition ${
                        post.likes?.includes(user)
                          ? "text-red-500"
                          : "text-gray-800 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className="w-6 h-6"
                        fill={post.likes?.includes(user) ? "red" : "none"}
                      />
                    </button>

                    <button
                      className="text-gray-800 hover:text-blue-500 transition"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle className="w-6 h-6" />
                    </button>

                    <button className="text-gray-800 hover:text-blue-500 transition">
                      <Send className="w-6 h-6" />
                    </button>
                  </div>

                  <button 
                    onClick={() => handlesaved(post.id)} 
                    className="text-gray-800 hover:text-blue-500 transition"
                  >
                    <Bookmark
                      className="w-6 h-6"
                      fill={post.saved ? "blue" : "none"}
                      stroke={post.saved ? "blue" : "currentColor"}
                    />
                  </button>
                </div>

                <div className="text-sm font-semibold mb-1">
                  {post.likes?.length || 0} likes
                </div>

                <div className="text-sm mb-1">
                  <span className="font-semibold">@{post.imageuser}:</span>{" "}
                  {post.caption || "No caption"}
                </div>

                {activeCommentPostId === post.id && (
                  <div className="mt-3 space-y-2">
                    {post.comments?.length > 0 ? (
                      post.comments.map((comment, i) => (
                        <div
                          key={comment._id || `${comment.username}-${i}`}
                          className="text-sm"
                        >
                          <span className="font-semibold">@{comment.username}:</span>{" "}
                          {comment.text}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No comments yet</div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:border-blue-400"
                        placeholder="Add a comment..."
                      />
                      <button
                        type="submit"
                        className="text-blue-600 font-semibold text-sm hover:underline"
                        disabled={!newComment.trim()}
                      >
                        Post
                      </button>
                    </form>
                  </div>
                )}

                
              </div>
            </article>
          ))}
        </main>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-200 py-3 px-6 flex justify-between md:hidden">
        <button className="text-blue-600">
          <Home className="w-6 h-6" />
        </button>
        <button className="text-gray-600 hover:text-blue-600">
          <Search className="w-6 h-6" />
        </button>
        <button
          className="text-gray-600 hover:text-blue-600"
          onClick={() => navigate("/dashboard/addpost")}
        >
          <PlusSquare className="w-6 h-6" />
        </button>
        <button className="text-gray-600 hover:text-blue-600">
          <Heart className="w-6 h-6" />
        </button>
        <button className="text-gray-600 hover:text-blue-600">
          <User className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}

export default Dhome;