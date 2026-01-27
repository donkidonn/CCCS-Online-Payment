import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import logoGreen from '../assets/logos/logogreen.png';
import studentFeatBg from '../assets/images/studentfeatbg.png';

function Payment() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // 'paypal' or 'card'
  const [showPayPal, setShowPayPal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    
    // Fetch account balance
    fetchAccountBalance(parsedUser.id);
  }, [navigate]);

  const fetchAccountBalance = async (accountId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/accounts/${accountId}/balance`);
      setAccountBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setAccountBalance(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setShowPayPal(false);
    setError('');
  };

  const handleConfirmPayment = () => {
    setError('');
    
    // Validation
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    
    if (parseFloat(paymentAmount) > accountBalance) {
      setError('Payment amount cannot exceed your account balance');
      return;
    }
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    if (!verified) {
      setError('Please verify that the details are accurate');
      return;
    }
    
    // Show PayPal buttons
    setShowPayPal(true);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: paymentAmount,
          currency_code: 'PHP'
        },
        description: `CCCS Payment - ${user.First_name} ${user.Last_name}`
      }]
    });
  };

  const onApprove = async (data, actions) => {
    setLoading(true);
    try {
      const details = await actions.order.capture();
      
      // Save payment to database
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments`, {
        account_id: user.id,
        amount_paid: paymentAmount,
        paypal_reference: details.id
      });

      if (response.data.success) {
        // Navigate to confirmation page
        navigate('/confirmation', {
          state: {
            paymentDetails: {
              amount: paymentAmount,
              reference: details.id,
              payer: details.payer.name.given_name + ' ' + details.payer.name.surname,
              date: new Date().toLocaleString()
            }
          }
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    setError('Payment failed. Please try again.');
    setLoading(false);
  };

  if (!user) {
    return null;
  }

  const initialOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "test",
    currency: "PHP",
    intent: "capture",
    components: "buttons",
    "disable-funding": "paylater,venmo"
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="min-h-screen w-full flex flex-col bg-white">
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
        <div 
          className="flex-1 px-8 py-12 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${studentFeatBg})`,
          }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <h1 className="font-gordita text-white text-3xl md:text-4xl mb-8 italic">
              Make online payment
            </h1>

            {/* Total Account Balance */}
            <div className="bg-white rounded-3xl p-8 mb-6 shadow-xl">
              <h2 className="font-gordita-bold text-gray-800 text-xl mb-4">Total Account Balance</h2>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 font-gordita-bold text-gray-600 text-lg">
                  PHP
                </span>
                <div className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-20 pr-6 py-4">
                  <p className="font-gordita-bold text-gray-900 text-lg">
                    {accountBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            {/* Specify Payment Amount */}
            <div className="bg-white rounded-3xl p-8 mb-6 shadow-xl">
              <h2 className="font-gordita-bold text-gray-800 text-xl mb-4">Specify your payment amount</h2>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 font-gordita-bold text-gray-600 text-lg">
                  PHP
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  max={accountBalance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-20 pr-6 py-4 text-lg font-gordita-bold text-gray-900 focus:border-green-600 focus:outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Select Payment Method */}
            <div className="bg-white rounded-3xl p-8 mb-6 shadow-xl">
              <h2 className="font-gordita-bold text-gray-800 text-xl mb-4">Select payment method</h2>
              
              {/* PayPal Option */}
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect('paypal')}
                className={`w-full flex items-center justify-between p-6 mb-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'paypal' 
                    ? 'border-green-600 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L7.418 21l1.106-7.006.03-.177.006-.035.007-.034c.014-.073.023-.115.023-.115a.805.805 0 0 1 .794-.68h2.449c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327h.12c1.173 0 2.12.955 2.12 2.133v1.84z"/>
                      <path d="M15.607 3.85H6.345A2.13 2.13 0 0 0 4.224 6v11.956a.48.48 0 0 0 .477.558h3.343a.804.804 0 0 0 .794-.679l.032-.17.63-3.992.04-.22a.805.805 0 0 1 .794-.68h.5c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327.792.146 1.508.452 2.109.936a2.13 2.13 0 0 0-2.12-2.133z"/>
                    </svg>
                  </div>
                  <span className="font-gordita-bold text-gray-800 text-lg">PayPal</span>
                </div>
                <svg 
                  className={`w-6 h-6 transition-transform ${paymentMethod === 'paypal' ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Card Option */}
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect('card')}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-green-600 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="font-gordita-bold text-gray-800 text-lg">Credit / Debit Card</span>
                </div>
                <svg 
                  className={`w-6 h-6 transition-transform ${paymentMethod === 'card' ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 mb-6">
                <p className="text-red-700 font-gordita text-sm">{error}</p>
              </div>
            )}

            {/* Verification Checkbox */}
            <div className="flex items-center gap-3 mb-8">
              <input
                type="checkbox"
                id="verify"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="w-6 h-6 border-2 border-white rounded cursor-pointer accent-green-600 flex-shrink-0"
              />
              <label htmlFor="verify" className="font-gordita text-white text-base cursor-pointer leading-6">
                I verify that the details provided above are accurate/correct
              </label>
            </div>

            {/* Confirm Payment Button */}
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full bg-[#9B8B5F] hover:bg-[#8a7a4f] text-white font-gordita-bold text-lg py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>

            {/* PayPal Modal */}
            {showPayPal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn my-8 max-h-[90vh] flex flex-col">
                  {/* Scrollable Content */}
                  <div className="overflow-y-auto flex-1 pr-2">
                    {/* Modal Header */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {paymentMethod === 'paypal' ? (
                          <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L7.418 21l1.106-7.006.03-.177.006-.035.007-.034c.014-.073.023-.115.023-.115a.805.805 0 0 1 .794-.68h2.449c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327h.12c1.173 0 2.12.955 2.12 2.133v1.84z"/>
                            <path d="M15.607 3.85H6.345A2.13 2.13 0 0 0 4.224 6v11.956a.48.48 0 0 0 .477.558h3.343a.804.804 0 0 0 .794-.679l.032-.17.63-3.992.04-.22a.805.805 0 0 1 .794-.68h.5c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327.792.146 1.508.452 2.109.936a2.13 2.13 0 0 0-2.12-2.133z"/>
                          </svg>
                        ) : (
                          <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        )}
                      </div>
                      <h3 className="font-gordita-bold text-gray-800 text-2xl mb-2">Complete Payment</h3>
                      <p className="font-gordita text-gray-600 text-sm mb-4">
                        You are paying <span className="font-gordita-bold text-green-700">PHP {parseFloat(paymentAmount).toFixed(2)}</span>
                      </p>
                    </div>

                    {/* PayPal Buttons */}
                    <div className="mb-4">
                      <PayPalButtons
                        key={paymentMethod}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        style={{
                          layout: 'vertical',
                          color: paymentMethod === 'card' ? 'black' : 'gold',
                          shape: 'pill',
                          label: 'pay'
                        }}
                        fundingSource={paymentMethod === 'card' ? 'card' : 'paypal'}
                      />
                    </div>

                    {/* Cancel Button */}
                    <button
                      onClick={() => setShowPayPal(false)}
                      className="w-full border-2 border-gray-300 text-gray-700 font-gordita-bold text-sm py-3 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white py-2 px-8 text-center border-t-2 border-gray-200">
          <p className="font-gordita text-gray-600 text-[10px] md:text-xs">
            © 2026 Cordova Catholic Cooperative School Online Payment System. All rights reserved
          </p>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

export default Payment;
