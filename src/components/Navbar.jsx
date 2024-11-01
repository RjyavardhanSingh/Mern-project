import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-lg">Story Writing Platform</Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white mx-2">Profile</Link>
              <Link to="/write" className="text-white mx-2">Write Story</Link>
              <button onClick={onLogout} className="text-white mx-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mx-2">Login</Link>
              <Link to="/signup" className="text-white mx-2">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
