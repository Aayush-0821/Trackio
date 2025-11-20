import React from "react";
import favicon from '../../assets/favIconPNG.png'
import {Link} from 'react-router-dom'

function Navbar( {onLoginClick , onSignupClick}) {
  return (
    <div className="w-full px-6 py-4 flex justify-between items-center absolute z-2">
      <div className="text-3xl font-bold text-orange-500 flex gap-3 cursor-pointer">
        <img className="h-10 " src={favicon} alt="T" />
        <h1>Trackio</h1>
      </div>

      <div className="hidden space-x-8 text-stone-200 text-lg font-medium">
        <div className="relative group cursor-pointer">
        <div className="relative group">
          Home
          <span className="absolute left-0 -bottom-1 w-0 h-0.25 bg-white transition-all duration-300 group-hover:w-full"></span>
        </div>
        </div>
        <div className="relative group cursor-pointer">
          About
          <span className="absolute left-0 -bottom-1 w-0 h-0.25 bg-white transition-all duration-300 group-hover:w-full"></span>
        </div>
        <div className="relative group cursor-pointer">
          Contact
          <span className="absolute left-0 -bottom-1 w-0 h-0.25 bg-white transition-all duration-300 group-hover:w-full"></span>
        </div>
        <div className="relative group cursor-pointer">
          Join Us
          <span className="absolute left-0 -bottom-1 w-0 h-0.25 bg-white transition-all duration-300 group-hover:w-full"></span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button onClick={onLoginClick} className="px-4 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition cursor-pointer">
          Login
        </button>
        <button onClick={onSignupClick} className="px-4 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition cursor-pointer">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Navbar;
