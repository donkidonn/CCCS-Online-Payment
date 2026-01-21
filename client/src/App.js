import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Confirmation from './pages/Confirmation';
import PendingVerification from './pages/PendingVerification';
import StudentHome from './pages/StudentHome';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';

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
        <Route path="/home" element={<Home />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
