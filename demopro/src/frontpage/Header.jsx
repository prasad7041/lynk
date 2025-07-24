import React from "react";
import { NavLink } from "react-router-dom";
import Lynk from "../assets/react.png";

function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-blue-500 shadow-md sticky top-0 z-50">
      {/* Logo - Smaller on mobile */}
      <div className="flex items-center">
        <img
          src={Lynk}
          alt="Logo"
          className="h-12 sm:h-16 w-auto max-w-[140px] sm:max-w-[180px] object-contain rounded-xl shadow-lg"
        />
        <span className="ml-2 sm:ml-3 text-white text-xl sm:text-2xl font-bold">
          Lynk
        </span>
      </div>

      {/* Right Side Buttons - Compact on mobile */}
      <div className="flex items-center bg-white rounded-full shadow-md px-1 sm:px-2 py-0.5 sm:py-1 space-x-0 sm:space-x-1">
        <NavLink
          to="/auth/create"
          className="text-blue-600 font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-300 hover:bg-blue-100 active:scale-95 sm:hover:scale-105"
        >
          <span className="text-sm sm:text-base">Get Started</span>
        </NavLink>
        <span className="text-gray-400 text-sm sm:text-base">|</span>
        <NavLink
          to="/auth/login"
          className="text-blue-600 font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-300 hover:bg-blue-100 active:scale-95 sm:hover:scale-105"
        >
          <span className="text-sm sm:text-base">Login</span>
        </NavLink>
      </div>
    </header>
  );
}

export default Header;