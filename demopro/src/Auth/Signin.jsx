import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [form, setform] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5501/user/create", form);
      console.log("account created::", res);
      localStorage.setItem("token", res.data.token);
      setMessage("");
      navigate("/setup");
    } catch (err) {
      console.error("signin failed:", err.response?.data?.message);
      setMessage(err.response?.data?.message || "signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-white animate-fadeIn">
      <form
        className="bg-white text-blue-600 shadow-2xl rounded-3xl p-8 w-80 animate-slideUp space-y-4"
        onSubmit={handlesubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

        <div className="space-y-1">
          <label className="block font-medium">Username:</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => {
              setform({ ...form, username: e.target.value });
            }}
            placeholder="Enter the Username"
            className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => {
              setform({ ...form, email: e.target.value });
            }}
            placeholder="Enter Your Email"
            className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium">Password:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => {
              setform({ ...form, password: e.target.value });
            }}
            placeholder="Enter the Password"
            className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          )}
          {loading ? "Creating..." : "Create"}
        </button>

        {message && (
          <p className="text-center text-red-600 font-semibold">{message}</p>
        )}

        <div className="text-sm text-center mt-2">
          Already have an account?{" "}
          <span className="text-blue-600 underline cursor-pointer">
            <Link to="/auth/login">Login </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signin;
