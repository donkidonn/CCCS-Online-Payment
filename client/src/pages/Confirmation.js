import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logoGreen from '../assets/logos/logogreen.png';
import studentFeatBg from '../assets/images/studentfeatbg.png';

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const paymentDetails = location.state?.paymentDetails;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if this is a payment confirmation
  const isPaymentConfirmation = !!paymentDetails;

  // If no data at all, redirect to home
  if (!formData && !paymentDetails) {
    navigate('/');
    return null;
  }

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/register`, formData);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate('/register', { state: { formData } });
  };

  // Payment Confirmation Page
  if (isPaymentConfirmation) {
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
              <p className="font-garet text-green-700 text-xs md:text-sm">Bursar Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => navigate('/student-home')}
              className="font-gordita-medium text-green-800 text-xs md:text-sm hover:text-green-600 transition-colors"
            >
              Back to Home
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="font-gordita-medium text-green-800 text-xs md:text-sm hover:text-green-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-fadeIn">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                <svg className="w-12 h-12 md:w-14 md:h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-gordita-bold text-gray-800 text-3xl md:text-4xl mb-3">
                Payment Successful!
              </h2>
              <p className="font-gordita text-gray-600 text-base md:text-lg">
                Your payment has been processed successfully
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="font-gordita-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Transaction Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-gordita text-gray-600">Amount Paid</span>
                  <span className="font-gordita-bold text-green-700 text-xl">
                    PHP {parseFloat(paymentDetails.amount).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-gordita text-gray-600">Reference Number</span>
                  <span className="font-gordita-medium text-gray-800 text-sm break-all">
                    {paymentDetails.reference}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-gordita text-gray-600">Paid By</span>
                  <span className="font-gordita-medium text-gray-800">
                    {paymentDetails.payer}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-gordita text-gray-600">Date & Time</span>
                  <span className="font-gordita-medium text-gray-800">
                    {paymentDetails.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/student-home')}
                className="flex-1 bg-[#2d5f3f] hover:bg-[#1a3d2b] text-white font-gordita-bold py-3 px-6 rounded-full transition-colors shadow-lg"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate('/transaction-history')}
                className="flex-1 bg-white hover:bg-gray-50 text-[#2d5f3f] border-2 border-[#2d5f3f] font-gordita-bold py-3 px-6 rounded-full transition-colors"
              >
                View Transactions
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white py-4 text-center border-t border-gray-200">
          <p className="font-gordita text-gray-600 text-sm">
            Need help? Contact CCCS Support
          </p>
        </div>
      </div>
    );
  }

  // Registration Confirmation Page (existing code)

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center relative px-8 py-12"
      style={{
        backgroundImage: "url('/images/loginbg.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {success ? (
          <div className="bg-white/90 rounded-3xl p-12 text-center animate-scale-in">
            <div className="text-green-600 text-6xl mb-6 animate-bounce-slow">✓</div>
            <h2 className="font-gordita-black text-3xl text-gray-800 mb-4">
              Account Created Successfully!
            </h2>
            <p className="font-gordita-medium text-gray-600 text-lg">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* Name */}
            <div>
              <label className="font-gordita-black text-white text-sm mb-2 block">
                Name
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.First_name}
                  className="font-gordita-medium px-4 py-3 rounded-full bg-white/90 text-gray-800 cursor-not-allowed"
                  readOnly
                  disabled
                />
                <input
                  type="text"
                  value={formData.Last_name}
                  className="font-gordita-medium px-4 py-3 rounded-full bg-white/90 text-gray-800 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* LRN */}
            <div>
              <label className="font-gordita-black text-white text-sm mb-2 block">
                Learner Reference Number
              </label>
              <input
                type="text"
                value={formData.LRN}
                className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>

            {/* Level/Section */}
            <div>
              <label className="font-gordita-black text-white text-sm mb-2 block">
                Level/Section
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.Grade_level}
                  className="font-gordita-medium px-4 py-3 rounded-full bg-white/90 text-gray-800 cursor-not-allowed"
                  readOnly
                  disabled
                />
                <input
                  type="text"
                  value={formData.Section}
                  className="font-gordita-medium px-4 py-3 rounded-full bg-white/90 text-gray-800 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-gordita-black text-white text-sm mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={formData.Email}
                className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-gordita-black text-white text-sm mb-2 block">
                Password
              </label>
              <input
                type="password"
                value="••••••••"
                className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 cursor-not-allowed mb-3"
                readOnly
                disabled
              />
              <input
                type="password"
                value="••••••••"
                className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>

            {error && (
              <div className="p-4 bg-red-600 text-white rounded-full text-center text-base font-gordita-medium">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center gap-6">
              <button
                onClick={handleEdit}
                className="font-gordita bg-[#9B8B5F] hover:bg-[#8a7a4f] text-white px-12 py-4 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Edit details
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="font-gordita bg-[#9B8B5F] hover:bg-[#8a7a4f] text-white px-8 py-4 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Processing...' : 'I confirm that the details provided are accurate'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Confirmation;
