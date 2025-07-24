import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Settings, Bookmark, Grid3x3, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [image, setImage] = useState(null);
  const [profilePic, setProfilePic] = useState();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [newUsername, setNewUsername] = useState("");
  const [newBio, setNewBio] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5501/user/userprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(res.data.posts || []);
        setUsername(res.data.user || "User");
        setNewUsername(res.data.user || "User");
        setProfilePic(res.data.profilepic);
        setBio(res.data.bio);
        setNewBio(res.data.bio || "");
        setFollowers(res.data.followers);
        setFollowing(res.data.following);
        setSaved(res.data.saved || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const handleChange = async (e) => {
    try {
      const selectedImage = e.target.files[0];
      if (!selectedImage) return;

      setImage(selectedImage);
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await fetch("http://localhost:5501/user/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProfilePic(data.imageUrl);
      } else {
        console.error("Image upload failed");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(
        "http://localhost:5501/user/updateprofile",
        { username: newUsername, bio: newBio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsername(newUsername);
      setBio(newBio);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen pb-16">
      {/* Profile Header */}
      <div className="px-4 py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-blue-500 overflow-hidden">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-500" />
                </div>
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <h1 className="text-2xl font-light">{username}</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-1 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    alert("this just for showcase");
                  }}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-8 mb-6">
              <div className="text-center">
                <span className="font-semibold">{posts.length}</span>
                <p className="text-gray-500 text-sm">Posts</p>
              </div>
              <div className="text-center">
                <span className="font-semibold">{followers.length}</span>
                <p className="text-gray-500 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <span className="font-semibold">{following.length}</span>
                <p className="text-gray-500 text-sm">Following</p>
              </div>
            </div>

            {editMode ? (
              <div className="flex flex-col gap-3 mb-4">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border p-2 rounded-md text-sm"
                  placeholder="Enter new username"
                />
                <input
                  type="text"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="border p-2 rounded-md text-sm"
                  placeholder="Enter new bio"
                />
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-max hover:bg-blue-600 text-sm"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-700">{bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-1 px-4 py-3 border-t-2 ${
            activeTab === "posts" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
          }`}
        >
          <Grid3x3 className="w-5 h-5" />
          <span className="text-xs font-medium uppercase">Posts</span>
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-1 px-4 py-3 border-t-2 ${
            activeTab === "saved" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-xs font-medium uppercase">Saved</span>
        </button>
      </div>

      {/* Posts/Saved Grid */}
      {activeTab === "posts" ? (
        posts.length > 0 ? (
          <div onClick={() => navigate("/dashboard/userposts")} className="grid grid-cols-3 gap-1">
            {posts.map((post, i) => (
              <div key={i} className="aspect-square bg-gray-100 relative group overflow-hidden">
                <img src={post.image} alt="pic" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-light mb-2">No Posts Yet</h3>
            <p className="text-gray-500 mb-4">When you share photos and videos, they'll appear here.</p>
          </div>
        )
      ) : saved.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {saved.map((item, i) => (
            <div key={i} className="aspect-square bg-gray-100 relative group overflow-hidden">
              <img src={item.imageurl} alt={`Saved ${i}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white px-1 text-xs">
                @{item.username}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-2xl font-light mb-2">No Saved Posts</h3>
          <p className="text-gray-500 mb-4">Posts you save will appear here.</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
