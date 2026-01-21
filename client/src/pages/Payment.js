import React, { useState } from 'react';
import axios from 'axios';

function Payment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/payments', formData);
      setMessage('Payment submitted successfully!');
      setFormData({ name: '', email: '', amount: '', description: '' });
    } catch (error) {
      setMessage('Error processing payment. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Make a Payment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Payment;
