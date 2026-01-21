import React from 'react';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to CCCS Online Payment System
        </h1>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          Make secure online payments quickly and easily. Our platform provides
          a safe and convenient way to handle your transactions.
        </p>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features:</h2>
          <ul className="space-y-3 ml-6 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Secure payment processing
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Real-time transaction tracking
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Payment history and receipts
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Multiple payment methods
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
