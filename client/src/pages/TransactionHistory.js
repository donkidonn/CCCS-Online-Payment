import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoGreen from '../assets/logos/logogreen.png';
import studentFeatBg from '../assets/images/studentfeatbg.png';

function TransactionHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
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

    // Fetch transaction history with fresh balance data
    fetchTransactionHistory(parsedUser.id);
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTransactionHistory = async (accountId) => {
    try {
      setLoading(true);
      
      // Fetch balance and payments
      const [balanceResponse, paymentsResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/accounts/${accountId}/balance`),
        fetch(`${process.env.REACT_APP_API_URL}/api/payments/account/${accountId}`)
      ]);
      
      if (!balanceResponse.ok || !paymentsResponse.ok) {
        throw new Error('Failed to fetch transaction history');
      }

      const balanceResult = await balanceResponse.json();
      const paymentsResult = await paymentsResponse.json();
      
      if (paymentsResult.success && balanceResult.success) {
        // Use balance from database
        const currentBalance = balanceResult.balance || 0;
        const processedTransactions = processTransactions(paymentsResult.data, currentBalance);
        setTransactions(processedTransactions);
      } else {
        setError('Unable to load transaction history');
      }
    } catch (err) {
      console.error('Error fetching transaction history:', err);
      setError('Failed to load transaction data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const processTransactions = (paymentsData, currentBalance) => {
    if (!paymentsData || paymentsData.length === 0) return [];

    console.log('Current Balance:', currentBalance);
    console.log('Payments Data:', paymentsData);

    // Sort by date ascending to calculate pending correctly
    const sorted = [...paymentsData].sort((a, b) => 
      new Date(a.paid_at) - new Date(b.paid_at)
    );

    // Calculate initial balance before any payments
    const totalPaid = sorted.reduce((sum, payment) => sum + parseFloat(payment.amount_paid || 0), 0);
    let runningPending = currentBalance + totalPaid;

    console.log('Total Paid:', totalPaid);
    console.log('Initial Pending (before any payments):', runningPending);

    // Process each transaction and calculate pending at that point in time
    const processed = sorted.map(payment => {
      const amountPaid = parseFloat(payment.amount_paid || 0);
      
      const transaction = {
        id: payment.payment_id,
        date: new Date(payment.paid_at),
        paid: amountPaid,
        pending: runningPending - amountPaid, // Pending AFTER this payment
        transactionId: payment.paypal_reference || `Payment #${payment.payment_id}`
      };

      // Update running balance for next transaction
      runningPending = runningPending - amountPaid;
      return transaction;
    });

    // Return in descending order (most recent first) for display
    return processed.reverse();
  };

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}-${day}-${year}`;
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
      <div className="flex-1 flex flex-col px-6 md:px-20 py-12 md:py-16">
        {/* Transaction History title */}
        <h2 className="text-white font-gordita-bold text-4xl md:text-5xl mb-10 md:mb-16 italic">
          Transaction history
        </h2>

        {/* Transaction Table Container */}
        <div className="max-w-6xl w-full mx-auto mb-12 animate-fade-in-up">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-4">
              {error}
            </div>
          )}

          {transactions.length === 0 ? (
            <div className="bg-white/90 rounded-3xl p-8 text-center">
              <p className="font-gordita text-gray-600 text-lg">No transactions found.</p>
            </div>
          ) : (
            <div className="bg-white/95 rounded-3xl shadow-2xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-[#2F5233] grid grid-cols-4 gap-4 px-6 md:px-8 py-4">
                <div className="font-gordita-bold text-white text-sm md:text-base">Date</div>
                <div className="font-gordita-bold text-white text-sm md:text-base">Paid</div>
                <div className="font-gordita-bold text-white text-sm md:text-base">Pending</div>
                <div className="font-gordita-bold text-white text-sm md:text-base">Ref #</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <div 
                    key={transaction.id}
                    className="grid grid-cols-4 gap-4 px-6 md:px-8 py-4 hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="font-gordita text-gray-800 text-sm md:text-base">
                      {formatDate(transaction.date)}
                    </div>
                    <div className="font-gordita-bold text-green-700 text-sm md:text-base">
                      PHP {transaction.paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="font-gordita text-gray-700 text-sm md:text-base">
                      PHP {transaction.pending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="font-gordita-bold text-gray-800 text-sm md:text-base">
                      {transaction.transactionId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleBack}
            className="group transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Go back"
          >
            <svg 
              width="60" 
              height="60" 
              viewBox="0 0 60 60" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <circle 
                cx="30" 
                cy="30" 
                r="28" 
                fill="white" 
                stroke="#2F5233" 
                strokeWidth="2"
                className="group-hover:fill-gray-100 transition-colors"
              />
              <path 
                d="M35 20L25 30L35 40" 
                stroke="#2F5233" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
