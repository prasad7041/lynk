import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ProfileSetup = ({ userid }) => {
  const [profilePic, setProfilePic] = useState(null); // File
  const [previewPic, setPreviewPic] = useState(null); // Image Preview URL
  const [bio, setBio] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    if (!file) return alert("Please select an image");
    const formData1 = new FormData();
      formData1.append("image", file);

      const uploadRes = await fetch("https://lynk-backend-bmv8.onrender.com/user/upload", {
        method: "POST",
        body: formData1,
      });

      const imageData = await uploadRes.json();
      console.log("Image upload response:", imageData);

      if (!imageData.imageUrl) return alert("Image upload failed");


    setProfilePic(imageData);
    setPreviewPic(URL.createObjectURL(file));
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!profilePic) return alert("Please select a profile picture");

      // Step 1: Upload image
      
      // Step 2: Send profile pic path & bio
      const formData2 = new FormData();
      formData2.append("profilepic", profilePic); // Adjust this key based on backend
      formData2.append("bio", bio);
      //console.log("form data 2 ::",formData2)
      console.log("profilepic::",profilePic.imageUrl)
      console.log("bio::",bio)
      const res2 =  await axios.post('http://localhost:5501/user/setup', {"profilepic": profilePic.imageUrl,
     "bio": bio
}, {
  headers: {
    "Content-Type": "multipart/form-data",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }

});



      console.log("Profile updated:", res2.data);
      alert("Profile updated successfully!");
      navigate('/dashboard/home');
    } catch (err) {
      console.error("error::",err);
      alert("Something went wrong, try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-light text-gray-800">Instagram</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                {previewPic ? (
                  <img
                    src={previewPic}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleUploadClick}
                className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </button>
            </div>
            <p className="text-sm text-gray-500">Add a profile photo</p>
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio (optional)
            </label>
            <textarea
              id="bio"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell your story..."
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-1.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded text-sm transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
