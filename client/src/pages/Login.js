import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    LRN: '',
    Password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/accounts/login', formData);
      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Check if user is validated
        if (response.data.user.Is_validated === false || response.data.user.Is_validated === 0) {
          navigate('/pending-verification');
        } else {
          navigate('/student-home');
        }
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative px-8 py-12"
      style={{
        backgroundImage: "url('/images/loginbg.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in"></div>
      
      {/* Logo and Title */}
      <div className="relative z-10 text-center mb-8 animate-slide-up">
        <div className="flex flex-col items-center">
          <img 
            src="/logos/logowhite.png" 
            alt="CCCS Logo" 
            className="w-100 h-100 md:w-108 md:h-56 object-contain drop-shadow-2xl"
          />
          <h1 className="font-old-english text-white text-4xl md:text-5xl mb-2 tracking-wide">
            Cordova Catholic Cooperative School
          </h1>
          <p className="font-garet text-white text-xl tracking-wider">
            Finance Portal
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-delay-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* LRN */}
          <div>
            <label className="font-gordita-black text-white text-sm mb-2 block">
              Learner Reference Number
            </label>
            <input
              type="text"
              name="LRN"
              placeholder="Complete LRN"
              value={formData.LRN}
              onChange={handleChange}
              className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-gordita-black text-white text-sm mb-2 block">
              Password
            </label>
            <input
              type="password"
              name="Password"
              placeholder="Password"
              value={formData.Password}
              onChange={handleChange}
              className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/80 text-white rounded-full text-center text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="font-gordita bg-[#9B8B5F] hover:bg-[#8a7a4f] text-white px-20 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
