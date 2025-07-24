import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("this is handle submit");
      const response = await axios.post("http://localhost:5501/user/login", form);
      console.log("response", response.data);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        console.log("storing token",response.data.token);
        navigate("/dashboard/home");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else if (err.request) {
        setError("No response from server. Is it running?");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-white animate-fadeIn">
      <form
        onSubmit={handlesubmit}
        className="bg-white text-blue-600 shadow-2xl rounded-3xl p-8 w-80 animate-slideUp space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>

        <div className="space-y-1">
          <label className="block font-medium">Username:</label>
          <input
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            value={form.username}
            type="text"
            placeholder="Enter the Username"
            className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium">Password:</label>
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
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
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        )}

        <div className="text-sm text-center mt-2">
          Don't have an account?{" "}
          <span className="text-blue-600 underline cursor-pointer">
            <Link to="/auth/create">Create</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
