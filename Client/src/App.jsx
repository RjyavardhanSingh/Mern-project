import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Profile from './components/Profile';
import WriteStory from './components/WriteStory';
import Interests from './components/Interests';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    // Store token in localStorage
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Update the Interests route to include user id as a parameter */}
        <Route path="/interests" element={<Interests />} />

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
