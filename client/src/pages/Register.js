import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    First_name: '',
    Last_name: '',
    LRN: '',
    Grade_level: '',
    Section: '',
    Email: '',
    Password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load data from confirmation page if editing
  useEffect(() => {
    if (location.state?.formData) {
      setFormData({
        ...location.state.formData,
        confirmPassword: '' // Don't prefill confirm password
      });
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Check if all required fields are filled
    if (!formData.First_name.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.Last_name.trim()) {
      setError('Last name is required');
      return false;
    }

    // Validate LRN (must be numbers only)
    if (!formData.LRN) {
      setError('LRN is required');
      return false;
    }
    if (!/^\d+$/.test(formData.LRN)) {
      setError('LRN must contain only numbers');
      return false;
    }

    // Validate Grade level (must be a number between 1-12)
    if (!formData.Grade_level) {
      setError('Grade level is required');
      return false;
    }
    const gradeLevel = parseInt(formData.Grade_level);
    if (isNaN(gradeLevel) || gradeLevel < 1 || gradeLevel > 12) {
      setError('Grade level must be a number between 1 and 12');
      return false;
    }

    // Validate Section
    if (!formData.Section.trim()) {
      setError('Section is required');
      return false;
    }

    // Validate Email format
    if (!formData.Email) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate Password
    if (!formData.Password) {
      setError('Password is required');
      return false;
    }
    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }
    if (formData.Password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate all form inputs
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Prepare data (remove confirmPassword)
    const { confirmPassword, ...registerData } = formData;

    // Navigate to confirmation page with data
    navigate('/confirmation', { state: { formData: registerData } });
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center gap-2 relative px-8 md:px-16 lg:px-20 py-12"
      style={{
        backgroundImage: "url('/images/loginbg.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in"></div>
      
      {/* Left Side - Logo and Title */}
      <div className="relative z-10 text-center flex-shrink-0 hidden lg:block -mt-20 animate-fade-in-delay-1">
        <div className="flex flex-col items-center">
          <img 
            src="/logos/logowhite.png" 
            alt="CCCS Logo" 
            className="w-100 h-100 md:w-108 md:h-96 object-contain drop-shadow-2xl"
          />
          <p className="font-garet text-white text-2xl tracking-wider">
            Finance Portal
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="relative z-10 w-full lg:w-auto lg:min-w-[500px] max-w-2xl animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="font-gordita-black text-white text-sm mb-2 block">
              Name
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="First_name"
                placeholder="First Name"
                value={formData.First_name}
                onChange={handleChange}
                className="font-gordita-medium px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <input
                type="text"
                name="Last_name"
                placeholder="Last Name"
                value={formData.Last_name}
                onChange={handleChange}
                className="font-gordita-medium px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
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
              name="LRN"
              placeholder="Input your LRN"
              value={formData.LRN}
              onChange={handleChange}
              className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {/* Level/Section */}
          <div>
            <label className="font-gordita-black text-white text-sm mb-2 block">
              Level/Section
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="Grade_level"
                placeholder="Grade level"
                value={formData.Grade_level}
                onChange={handleChange}
                className="font-gordita-medium px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
                min="1"
                max="12"
                step="1"
              />
              <input
                type="text"
                name="Section"
                placeholder="Section"
                value={formData.Section}
                onChange={handleChange}
                className="font-gordita-medium px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
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
              name="Email"
              placeholder="Email"
              value={formData.Email}
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
              className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white mb-3"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="font-gordita-medium w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-600 text-white rounded-full text-center text-base font-gordita-medium">
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
              {loading ? 'Creating...' : 'Next Step'}
            </button>
          </div>

          <p className="text-center text-white text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-gordita-black underline hover:text-gray-200">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
