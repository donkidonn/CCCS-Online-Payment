import React, { useState, useEffect } from 'react';
import '../index.css';

const AdminAddEditBalance = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editBalance, setEditBalance] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Get admin user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setAdminUser(JSON.parse(userData));
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/all-balances`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched students:', data);
      
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchStudents();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/accounts/search-balances?query=${searchTerm}`
      );
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditBalance(student.balance || 0);
  };

  const handleSave = async (studentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/${studentId}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance: parseFloat(editBalance) }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditBalance('');
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditBalance('');
  };

  const formatCurrency = (amount) => {
    return `₱${parseFloat(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#d4d4d4' }}>
      {/* Header */}
      <div className="text-white p-3 md:p-4 flex items-center justify-between md:justify-center" style={{ backgroundColor: '#2d5f3f' }}>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 hover:bg-green-700 rounded"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          <img src="/logos/logowhite.png" alt="CCCS Logo" className="h-10 w-10 md:h-16 md:w-16 rounded-full object-cover" />
          <div className="text-center">
            <h1 className="text-lg md:text-2xl font-serif">Cordova Catholic Cooperative School</h1>
            <p className="text-xs md:text-sm">Finance Portal</p>
          </div>
        </div>

        {/* Spacer for mobile to center logo */}
        <div className="md:hidden w-10"></div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed md:relative z-50 md:z-0 w-64 md:w-48 text-white min-h-screen transform transition-transform duration-300 md:transform-none ${
            showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{ backgroundColor: '#1a3d2b' }}
        >
          <div className="p-4 flex items-center gap-3 border-b border-green-800">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">
                {adminUser ? `${adminUser.First_name} ${adminUser.Last_name}` : 'Admin user'}
              </div>
              <div className="text-xs opacity-75">Admin</div>
            </div>
          </div>

          <nav className="mt-4">
            <a
              href="/admin/student-accounts"
              className="flex items-center gap-3 px-4 py-3 hover:bg-green-800"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Student accounts</span>
            </a>
            <a
              href="/admin/add-edit-balance"
              className="flex items-center gap-3 px-4 py-3 hover:bg-green-800"
              style={{ backgroundColor: '#2d5f3f' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <span>Add/edit balance</span>
            </a>
            <a href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-green-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Log-out</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-light italic mb-4 md:mb-6 text-gray-700">Add/edit balance</h2>

          {/* Search Bar */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <label className="font-medium text-gray-700 whitespace-nowrap text-sm sm:text-base">Name/LRN:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                placeholder="Search by name or LRN..."
              />
              <button
                onClick={handleSearch}
                className="px-4 sm:px-6 py-2 text-white rounded font-medium hover:opacity-90 text-sm sm:text-base"
                style={{ backgroundColor: '#7a9b6f' }}
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="px-4 sm:px-6 py-2 text-white rounded font-medium hover:opacity-90 text-sm sm:text-base"
                style={{ backgroundColor: '#7a9b6f' }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-300">#</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-300">Total Balance</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-300">Total Amount Paid</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-300">Amount Payable</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-300">Due</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : !Array.isArray(students) || students.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={student.id} className="border border-gray-300">
                      <td className="px-4 py-3 border border-gray-300">{index + 1}</td>
                      <td className="px-4 py-3 border border-gray-300">
                        {student.First_name} {student.Last_name}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        {editingId === student.id ? (
                          <input
                            type="number"
                            value={editBalance}
                            onChange={(e) => setEditBalance(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            step="0.01"
                          />
                        ) : (
                          formatCurrency(student.balance)
                        )}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        {formatCurrency(student.total_paid)}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        {formatCurrency(student.amount_payable)}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        {formatCurrency(student.balance - student.total_paid)}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        {editingId === student.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(student.id)}
                              className="px-4 py-1.5 text-white rounded text-sm font-medium hover:opacity-90"
                              style={{ backgroundColor: '#7a9b6f' }}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-4 py-1.5 bg-gray-500 text-white rounded text-sm font-medium hover:opacity-90"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(student)}
                            className="px-4 py-1.5 text-white rounded text-sm font-medium hover:opacity-90"
                            style={{ backgroundColor: '#7a9b6f' }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddEditBalance;
