import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // If no data, redirect back to register
  if (!formData) {
    navigate('/register');
    return null;
  }

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/accounts/register', formData);
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
