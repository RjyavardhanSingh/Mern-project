import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Profile from './components/Profile';
import WriteStory from './components/WriteStory';
import Interests from './components/Interests';
import Library from './components/Library';
import StoryDetails from './components/StoryDetails';
import EditStory from './components/EditStory'; // Import the StoryEdit component

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
        <Route path="/interests" element={<Interests />} />
        
        {/* Protect Profile, WriteStory, and Library routes */}
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/write" 
          element={isAuthenticated ? <WriteStory /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/library" 
          element={isAuthenticated ? <Library /> : <Navigate to="/login" />} 
        />

        {/* Route for story details */}
        <Route path="/stories/:id" element={<StoryDetails />} />

        {/* New route for editing a story */}
        <Route 
          path="/edit-story/:id" 
          element={isAuthenticated ? <EditStory /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
