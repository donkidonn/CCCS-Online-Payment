import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoGreen from '../assets/logos/logogreen.png';
import studentFeatBg from '../assets/images/studentfeatbg.png';

function AccountBalance() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accountData, setAccountData] = useState({
    totalBalance: 0,
    totalPaid: 0,
    amountPayable: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    // Fetch actual account balance data from API
    fetchAccountBalance(parsedUser.id);
  }, [navigate]);

  const fetchAccountBalance = async (accountId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/accounts/${accountId}/balance-details`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch account balance');
      }

      const result = await response.json();
      
      if (result.success) {
        setAccountData(result.data);
      } else {
        setError('Unable to load account balance');
      }
    } catch (err) {
      console.error('Error fetching account balance:', err);
      setError('Failed to load account data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/student-home');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: `url(${studentFeatBg})` }}>
        <div className="text-white text-2xl font-gordita-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: `url(${studentFeatBg})` }}>
      
      {/* Header */}
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
            <p className="font-garet text-green-700 text-xs md:text-sm">Finance Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/student-home')}
            className="font-gordita-medium text-green-800 text-xs md:text-sm hover:text-green-600 transition-colors"
          >
            Back to Home
          </button>
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
      <div className="flex-1 flex flex-col px-6 md:px-20 py-12 md:py-16">
        {/* Account balance title */}
        <h2 className="text-white font-gordita-bold text-4xl md:text-5xl mb-10 md:mb-16 italic">
          Account balance
        </h2>

        {/* Balance Cards Container */}
        <div className="max-w-5xl w-full mx-auto space-y-6 md:space-y-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-4">
              {error}
            </div>
          )}

          {/* Total Account Balance */}
          <div className="bg-[#A8B5A0] rounded-3xl p-6 md:p-8 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up">
            <h3 className="font-gordita-bold text-gray-800 text-xl md:text-2xl mb-4">
              Total Account Balance
            </h3>
            <div className="bg-white rounded-2xl px-6 py-4 md:py-5">
              <p className="font-gordita-bold text-gray-900 text-2xl md:text-3xl">
                PHP {accountData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Total Amount Paid */}
          <div className="bg-[#A8B5A0] rounded-3xl p-6 md:p-8 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-200">
            <h3 className="font-gordita-bold text-gray-800 text-xl md:text-2xl mb-4">
              Total Amount Paid
            </h3>
            <div className="bg-white rounded-2xl px-6 py-4 md:py-5">
              <p className="font-gordita-bold text-gray-900 text-2xl md:text-3xl">
                PHP {accountData.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Amount Payable (Pending) */}
          <div className="bg-[#A8B5A0] rounded-3xl p-6 md:p-8 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-400">
            <h3 className="font-gordita-bold text-gray-800 text-xl md:text-2xl mb-4">
              Amount Payable (Pending)
            </h3>
            <div className="bg-white rounded-2xl px-6 py-4 md:py-5">
              <p className="font-gordita-bold text-gray-900 text-2xl md:text-3xl">
                PHP {accountData.amountPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-8 mt-12 md:mt-16">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="group transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in-up animation-delay-600"
            aria-label="Go back"
          >
            <svg 
              width="70" 
              height="70" 
              viewBox="0 0 70 70" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl"
            >
              <circle 
                cx="35" 
                cy="35" 
                r="32" 
                fill="white" 
                stroke="#2F5233" 
                strokeWidth="3"
                className="group-hover:fill-gray-100 transition-all duration-300"
              />
              <path 
                d="M40 25L28 35L40 45" 
                stroke="#2F5233" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="group-hover:stroke-[#9B8B5F] transition-colors duration-300"
              />
            </svg>
          </button>

          {/* Proceed to Payment Button */}
          <button
            onClick={() => navigate('/payment')}
            className="bg-[#9B8B5F] hover:bg-[#8a7a4f] text-white font-gordita-bold text-lg py-4 px-12 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up animation-delay-600"
          >
            Proceed to payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountBalance;
