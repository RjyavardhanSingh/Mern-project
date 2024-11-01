// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Profile from './components/Profile';
import WriteStory from './components/WriteStory';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/write" 
          element={isAuthenticated ? <WriteStory /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
