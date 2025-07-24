import React from "react";
import Login from "./Login";
import Signin from "./Signin";
import Dashboard from "../dashboard/Dasgboard";
import { Outlet } from "react-router-dom";
import { BrowserRouter,Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Link } from "react-router-dom";
function Authe(){
    return(
        <div>
              <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white text-blue-700">
                {/* NavBar */}
                <nav className="bg-white shadow-md px-6 py-4 flex justify-center items-center gap-6 animate-fadeIn">
                  <Link
                    to="/auth/create"
                    className="text-lg font-semibold hover:text-blue-600 transition duration-300"
                  >
                    Sign In
                  </Link>
                  <span className="text-gray-400">|</span>
                  <Link
                    to="/auth/login"
                    className="text-lg font-semibold hover:text-blue-600 transition duration-300"
                  >
                    Log In
                  </Link>
                </nav>
        
                {/* Routes */}
                
                  <Outlet />
                
              </div>
            </div>
    )
}

export default Authe