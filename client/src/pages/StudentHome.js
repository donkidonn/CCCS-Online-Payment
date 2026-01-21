import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoGreen from '../assets/logos/logogreen.png';
import historyLogo from '../assets/logos/historylogo.png';
import paymentLogo from '../assets/logos/paymentlogo.png';
import balanceLogo from '../assets/logos/balancelogo.png';

function StudentHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    
    // Check if user is validated
    if (parsedUser.Is_validated === false || parsedUser.Is_validated === 0) {
      navigate('/pending-verification');
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col relative"
      style={{
        backgroundImage: "url('/images/loginbg.png')",
      }}
    >
      {/* Header with logo and Visit Portal link */}
      <div className="bg-white py-3 px-6 md:px-12 flex items-center justify-between shadow-lg border-b-4 border-green-700">
        <div className="flex items-center gap-3">
          <img 
            src={logoGreen}
            alt="CCCS Logo" 
            className="w-14 h-14 object-contain"
          />
          <div>
            <h2 className="font-old-english text-green-800 text-lg md:text-xl leading-tight">
              Cordova Catholic Cooperative School
            </h2>
            <p className="font-garet text-green-700 text-xs md:text-sm">Finance Cordova Academy</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <a href="#" className="font-gordita-medium text-green-800 text-xs md:text-sm hover:text-green-600 transition-colors">
            Visit Portal
          </a>
          <span className="text-gray-400">|</span>
          <button 
            onClick={handleLogout}
            className="font-gordita-medium text-green-800 text-xs md:text-sm hover:text-green-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-garet text-green-800 text-2xl md:text-3xl mb-1 drop-shadow-lg">Welcome,</h1>
          <h2 className="font-old-english text-green-800 text-4xl md:text-5xl italic drop-shadow-lg">
            ({user.First_name})!
          </h2>
        </div>

        {/* School Logo */}
        <div className="mb-10 animate-scale-in">
          <img 
            src="/logos/logowhite.png" 
            alt="CCCS Logo" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 animate-fade-in-delay-2 max-w-4xl">
          {/* View History Button */}
          <button
            onClick={() => navigate('/transaction-history')}
            className="group bg-[#9B8B5F] hover:bg-[#8a7a4f] rounded-2xl px-6 py-5 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center gap-3 w-44 border-2 border-white/20"
          >
            <div className="bg-white/20 p-3 rounded-full">
              <img 
                src={historyLogo}
                alt="History" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="font-gordita-bold text-white text-center text-xs leading-tight">
              View history of transactions
            </span>
          </button>

          {/* Make Payment Button */}
          <button
            onClick={() => navigate('/payment')}
            className="group bg-[#9B8B5F] hover:bg-[#8a7a4f] rounded-2xl px-6 py-5 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center gap-3 w-44 border-2 border-white/20"
          >
            <div className="bg-white/20 p-3 rounded-full">
              <img 
                src={paymentLogo}
                alt="Payment" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="font-gordita-bold text-white text-center text-xs leading-tight">
              Make online payment
            </span>
          </button>

          {/* View Balance Button */}
          <button
            onClick={() => navigate('/account-balance')}
            className="group bg-[#9B8B5F] hover:bg-[#8a7a4f] rounded-2xl px-6 py-5 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center gap-3 w-44 border-2 border-white/20"
          >
            <div className="bg-white/20 p-3 rounded-full">
              <img 
                src={balanceLogo}
                alt="Balance" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="font-gordita-bold text-white text-center text-xs leading-tight">
              View account fees/balance
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-2 px-8 text-center border-t-2 border-gray-200">
        <p className="font-gordita text-gray-600 text-[10px] md:text-xs">
          Cordova Catholic Cooperative School Online Payment System. Powered by Cordova Catholic Cooperative School
        </p>
      </div>
    </div>
  );
}

export default StudentHome;
