import React, { useState } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import axios from "axios";

function PostViewer({ post, onClose, currentUser, token, profilepic }) {
  const [localPost, setLocalPost] = useState(post);
  const [newComment, setNewComment] = useState("");
  const [isFollowing, setIsFollowing] = useState(
    post.profile?.followers?.includes(currentUser)
  );
  const [followLoading, setFollowLoading] = useState(false);

  const handleLike = async () => {
    try {
      await axios.post(
        "http://localhost:5501/user/handlelikes",
        { targetid: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const liked = localPost.likes?.includes(currentUser);
      const updatedLikes = liked
        ? localPost.likes.filter((u) => u !== currentUser)
        : [...(localPost.likes || []), currentUser];

      setLocalPost((prev) => ({ ...prev, likes: updatedLikes }));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { data } = await axios.post(
        "http://localhost:5501/user/comment",
        { postid: post._id, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLocalPost((prev) => ({ ...prev, comment: data.post.comment || [] }));
      setNewComment("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await axios.post(
          "http://localhost:5501/user/unfollow",
          { targetname: post.imageuser },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5501/user/follow",
          { targetname: post.imageuser },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Follow/Unfollow failed:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden flex flex-col sm:flex-row relative">
        {/* Left: Image */}
        <div className="w-full sm:w-2/3 bg-black flex items-center justify-center">
          <img
            src={localPost.image}
            alt="post"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right: Info */}
        <div className="w-full sm:w-1/3 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <img
                src={profilepic || "/default-profile.png"}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold">@{localPost.imageuser}</span>

              
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-black">
              <X size={22} />
            </button>
          </div>

          {/* Caption */}
          <div className="px-4 py-2 border-b text-sm">
            <p>
              <span className="font-semibold">@{localPost.imageuser}</span>{" "}
              {localPost.caption}
            </p>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-4 py-2 text-sm space-y-2">
            {localPost.comment?.length > 0 ? (
              localPost.comment.map((c, i) => (
                <div key={i}>
                  <span className="font-semibold">{c.username}</span> {c.text}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>

          {/* Actions */}
          <div className="border-t px-4 py-3 space-y-2">
            <div className="flex items-center gap-4">
              <button onClick={handleLike}>
                <Heart
                  size={20}
                  className={`${
                    localPost.likes?.includes(currentUser)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-500"
                  }`}
                />
              </button>
              <MessageCircle size={20} className="text-gray-500" />
            </div>
            <div className="text-sm text-gray-700">
              ❤️ {localPost.likes?.length || 0} likes
            </div>

            {/* Comment Input */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                className="text-blue-500 font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostViewer;
