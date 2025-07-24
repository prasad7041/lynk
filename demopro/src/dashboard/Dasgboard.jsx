import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Search, PlusSquare, MessageCircle, User, LogOut } from "lucide-react";
import Lynk from "../assets/react.png";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Navigation */}
      <div className="hidden md:flex flex-col w-64 px-4 py-8 bg-white border-r border-gray-200 fixed h-full">
        <div className="flex items-center gap-3 mb-10 px-2">
          <img src={Lynk} className="w-auto h-8" alt="logo" />
          <span className="text-xl font-bold text-blue-600">lynk</span>
        </div>
        
        <nav className="flex flex-col space-y-3">
          <NavLink
            to="/dashboard/home"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/search"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/addpost"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <PlusSquare className="w-5 h-5" />
            <span>Create</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/message"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <MessageCircle className="w-5 h-5" />
            <span>Messages</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        </nav>
        
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile Top Bar */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-10">
          <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <img src={Lynk} className="w-auto h-8" alt="logo" />
              <span className="text-lg font-semibold text-blue-600">lynk</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <main className="pt-16 md:pt-0 pb-16 md:pb-0 min-h-screen">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-10">
          <div className="max-w-md mx-auto flex justify-around px-4 py-3">
            <NavLink
              to="/dashboard/home"
              className={({ isActive }) =>
                `p-3 rounded-full transition-all ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
                }`
              }
            >
              <Home className="w-6 h-6" />
            </NavLink>
            <NavLink
              to="/dashboard/search"
              className={({ isActive }) =>
                `p-3 rounded-full transition-all ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
                }`
              }
            >
              <Search className="w-6 h-6" />
            </NavLink>
            <NavLink
              to="/dashboard/addpost"
              className={({ isActive }) =>
                `p-3 rounded-full transition-all ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
                }`
              }
            >
              <PlusSquare className="w-6 h-6" />
            </NavLink>
            <NavLink
              to="/dashboard/message"
              className={({ isActive }) =>
                `p-3 rounded-full transition-all ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
                }`
              }
            >
              <MessageCircle className="w-6 h-6" />
            </NavLink>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `p-3 rounded-full transition-all ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
                }`
              }
            >
              <User className="w-6 h-6" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;