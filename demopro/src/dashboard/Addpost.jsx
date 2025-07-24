import React, { useState } from "react";
import axios from "axios";
import { X, Image, Smile, MapPin, User, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Addpost() {
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ Needed for upload
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file); // ✅ Save selected file

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select an image first");

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadRes = await fetch("http://localhost:5501/user/upload", {
        method: "POST",
        body: formData,
      });

      const { imageUrl } = await uploadRes.json();
      if (!imageUrl) throw new Error("Image upload failed");

      const postRes = await axios.post(
        "http://localhost:5501/user/addpost",
        { image: imageUrl, caption },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log("post before creating::",imageUrl,caption);
      console.log("Post Created:", postRes.data);
      navigate("/dashboard/home");
    } catch (err) {
      console.error("Error:", err);
      alert("Error creating post");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <header className="border-b border-gray-200 py-3 px-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">New Post</h2>
        <button
          onClick={handleSubmit}
          disabled={isUploading || !imagePreview}
          className={`flex items-center gap-1 text-blue-500 font-medium ${
            (!imagePreview || isUploading) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Sharing...
            </>
          ) : (
            "Share"
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col h-[calc(100vh-104px)]">
        {!imagePreview ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Image className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Photo</h3>
            <p className="text-gray-500 mb-6 text-center max-w-xs">
              Choose a photo to share with your followers
            </p>
            <label className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition cursor-pointer">
              Select from device
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Smaller Image Preview */}
            <div className="relative bg-gray-100 flex justify-center items-center py-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-[300px] max-w-[300px] object-contain rounded-md"
              />
              <button
                onClick={removeImage}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Caption Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full h-20 resize-none outline-none text-sm"
                    maxLength="2200"
                  />
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <div className="flex gap-2">
                      <button type="button" className="hover:text-blue-500">
                        <Smile className="w-4 h-4" />
                      </button>
                      <button type="button" className="hover:text-blue-500">
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                    <span>{caption.length}/2,200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Addpost;
