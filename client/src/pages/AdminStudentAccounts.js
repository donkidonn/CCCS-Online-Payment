import React, { useState, useEffect } from 'react';
import '../index.css';

const AdminStudentAccounts = () => {
  const [activeTab, setActiveTab] = useState('verified');
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Get admin user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setAdminUser(JSON.parse(userData));
    }
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/status/${activeTab}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched accounts:', data);
      
      // Ensure data is an array
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchAccounts();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/accounts/search?query=${searchTerm}&status=${activeTab}`
      );
      const data = await response.json();
      // Ensure data is an array
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    fetchAccounts();
  };

  const handleVerify = async (accountId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/${accountId}/verify`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error verifying account:', error);
    }
  };

  const handleUnverify = async (accountId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/${accountId}/unverify`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error unverifying account:', error);
    }
  };

  const handleDelete = async (accountId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/${accountId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const openModal = (action, account) => {
    setModalAction(action);
    setSelectedAccount(account);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setSelectedAccount(null);
  };

  const confirmAction = async () => {
    if (!selectedAccount) return;

    if (modalAction === 'delete') {
      await handleDelete(selectedAccount.id);
    } else if (modalAction === 'unverify') {
      await handleUnverify(selectedAccount.id);
    }

    closeModal();
  };

  const getModalMessage = () => {
    if (modalAction === 'delete') {
      return 'Are you sure you want to delete this account?';
    } else if (modalAction === 'unverify') {
      return 'Are you sure you want to unverify this account?';
    }
    return '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#d4d4d4' }}>
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg p-8 max-w-md w-full mx-4" style={{ backgroundColor: '#2d5f3f' }}>
            <p className="text-white text-lg mb-6">{getModalMessage()}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#1a3d2b' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#7a9b6f' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-white p-4 flex items-center justify-center" style={{ backgroundColor: '#2d5f3f' }}>
        <div className="flex items-center gap-3">
          <img src="/logos/logowhite.png" alt="CCCS Logo" className="h-16 w-16 rounded-full object-cover" />
          <div className="text-center">
            <h1 className="text-2xl font-serif">Cordova Catholic Cooperative School</h1>
            <p className="text-sm">Bursar Portal</p>
          </div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-48 text-white min-h-screen" style={{ backgroundColor: '#1a3d2b' }}>
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
              style={{ backgroundColor: '#2d5f3f' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Student accounts</span>
            </a>
            <a href="/admin/add-edit-balance" className="flex items-center gap-3 px-4 py-3 hover:bg-green-800">
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
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-light italic mb-6 text-gray-700">Student accounts status</h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-8 py-3 rounded-full font-medium transition-colors ${
                activeTab === 'verified'
                  ? 'text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              style={activeTab === 'verified' ? { backgroundColor: '#7a9b6f' } : {}}
            >
              Verified accounts
            </button>
            <button
              onClick={() => setActiveTab('unverified')}
              className={`px-8 py-3 rounded-full font-medium border-2 transition-colors ${
                activeTab === 'unverified'
                  ? 'bg-white border-gray-600 text-gray-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              Unverified accounts
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <label className="font-medium text-gray-700 whitespace-nowrap">Name/LRN:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search by name or LRN..."
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 text-white rounded font-medium hover:opacity-90"
                style={{ backgroundColor: '#7a9b6f' }}
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-2 text-white rounded font-medium hover:opacity-90"
                style={{ backgroundColor: '#7a9b6f' }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-300">#</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-300">LRN</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-300">
                    {activeTab === 'verified' ? 'Date Verified' : 'Date Registered'}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : !Array.isArray(accounts) || accounts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  accounts.map((account, index) => (
                    <tr key={account.id} className="border-t border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-200">{index + 1}</td>
                      <td className="px-4 py-3 border-r border-gray-200">
                        {account.First_name} {account.Last_name}
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200">{account.LRN}</td>
                      <td className="px-4 py-3 border-r border-gray-200">
                        {formatDate(account.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {activeTab === 'verified' ? (
                            <>
                              <button
                                onClick={() => openModal('unverify', account)}
                                className="px-4 py-1.5 text-white rounded text-sm font-medium hover:opacity-90"
                                style={{ backgroundColor: '#7a9b6f' }}
                              >
                                Unverify
                              </button>
                              <button
                                onClick={() => openModal('delete', account)}
                                className="px-4 py-1.5 text-white rounded text-sm font-medium hover:opacity-90"
                                style={{ backgroundColor: '#7a9b6f' }}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleVerify(account.id)}
                                className="px-4 py-1.5 text-white rounded text-sm font-medium hover:opacity-90"
                                style={{ backgroundColor: '#7a9b6f' }}
                              >
                                Verify
                              </button>
                              <button
                                onClick={() => openModal('delete', account)}
                                className="px-4 py-1.5 text-white rounded text-sm font-medium hover:opacity-90"
                                style={{ backgroundColor: '#7a9b6f' }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
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

export default AdminStudentAccounts;
