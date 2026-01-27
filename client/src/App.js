import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Confirmation from './pages/Confirmation';
import PendingVerification from './pages/PendingVerification';
import StudentHome from './pages/StudentHome';
import Payment from './pages/Payment';
import AccountBalance from './pages/AccountBalance';
import TransactionHistory from './pages/TransactionHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/pending-verification" element={<PendingVerification />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/account-balance" element={<AccountBalance />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
