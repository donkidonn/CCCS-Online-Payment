import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/images/loginbg.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div className="mb-6 flex justify-center animate-scale-in">
          <img 
            src="/logos/logowhite.png" 
            alt="CCCS Logo" 
            className="w-100 h-100 md:w-108 md:h-96 object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* School Name */}
        <h1 className="font-old-english text-white text-4xl md:text-5xl lg:text-6xl mb-3 tracking-wide animate-fade-in-delay-1">
          Cordova Catholic Cooperative School
        </h1>
        
        {/* Subtitle */}
        <p className="font-garet text-white text-xl md:text-2xl mb-20 tracking-wider animate-fade-in-delay-2">
          Finance Portal
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-delay-3">
          <Link
            to="/login"
            className="font-gordita bg-[#9B8B5F] hover:bg-[#8a7a4f] text-white px-16 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-w-[240px]"
          >
            Log in
          </Link>
          
          <Link
            to="/register"
            className="font-gordita bg-[#9B8B5F] hover:bg-[#8a7a4f] text-white px-16 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-w-[240px]"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
