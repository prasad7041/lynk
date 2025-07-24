import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setQuery(value);
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(async () => {
        if (value.trim() === "") {
          setResults([]);
          return;
        }

        try {
          const res = await axios.get(`http://localhost:5501/user/search?q=${value}`);
          setResults(res.data);
        } catch (err) {
          console.error("Search failed", err);
        }
      }, 400)
    );
  };

  const handleUserClick = (username) => {
    navigate(`/dashboard/target/${username}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for users"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {results.length > 0 && (
        <div className="mt-4 bg-white rounded shadow-md">
          {results.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleUserClick(user.username)}
            >
              <img
                src={user.profilepic || "/default-profile.png"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-800 font-medium">@{user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
