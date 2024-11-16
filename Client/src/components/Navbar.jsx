import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to the search results page with the query
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-lg">
          Story Writing Platform
        </Link>
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories, tags, or authors"
            className="p-2 rounded-l-md border-none focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-blue-600 p-2 text-2xl rounded-r-md hover:bg-gray-200"
          >
            <CiSearch />
          </button>
        </form>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white mx-2">
                Profile
              </Link>
              <Link to="/write" className="text-white mx-2">
                Write Story
              </Link>
              <Link to="/library" className="text-white mx-2">
                Library
              </Link>
              <button onClick={handleLogout} className="text-white mx-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mx-2">
                Login
              </Link>
              <Link to="/signup" className="text-white mx-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
