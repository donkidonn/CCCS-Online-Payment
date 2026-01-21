import React from 'react';
import { useNavigate } from 'react-router-dom';

function PendingVerification() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative px-8 py-12"
      style={{
        backgroundImage: "url('/images/loginbg.png')",
      }}
    >
      {/* Dark overlay with animation */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in"></div>
      
      {/* Content Container with slide-up animation */}
      <div className="relative z-10 max-w-2xl mx-auto text-center animate-slide-up">
        {/* Logo with pulse animation */}
        <div className="mb-0 animate-pulse-slow">
          <img 
            src="/logos/logowhite.png" 
            alt="CCCS Logo" 
            className="w-80 h-80 mx-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Message Card with scale animation */}
        <div className="-mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-105">
          <h1 className="font-gordita-black text-white text-3xl md:text-4xl mb-6 leading-relaxed animate-fade-in-delay-1">
            Your account is currently pending verification.
          </h1>
          <p className="font-gordita-medium text-white/90 text-xl md:text-2xl mb-4 animate-fade-in-delay-2">
            Please wait for confirmation and validation.
          </p>
          <p className="font-gordita text-white/80 text-lg md:text-xl mb-10 animate-fade-in-delay-3">
            Kindly check back periodically for updates.
          </p>

          {/* Go Back Button with hover effect */}
          <button
            onClick={handleGoBack}
            className="font-gordita bg-[#9B8B5F] hover:bg-[#8a7a4f] text-white px-16 py-4 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 animate-fade-in-delay-4"
          >
            Go back
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center gap-2 animate-fade-in-delay-5">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce-slow"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce-slow" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce-slow" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default PendingVerification;
