import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch, CiMenuBurger } from "react-icons/ci";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Search Query:", searchQuery);
    if (searchQuery.trim()) {
      try {
        const response = await fetch(
          API_ENDPOINTS.SEARCH(searchQuery)
        );
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
          setShowResults(true);
        } else {
          console.error("Error fetching search results:", response.statusText);
        }
      } catch (error) {
        console.error("Error performing search:", error);
      }
    }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    if (result.type === "story") {
      navigate(`/stories/${result.id}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white shadow-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-[#D4AF37]">StoryWrite</span>
          </Link>
          <div className="hidden md:flex-1 md:flex md:justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, tags, or authors"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm"
                />
              </form>
              {showResults && searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-gray-900 shadow-lg rounded-md max-h-60 overflow-y-auto z-10">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-2 cursor-pointer hover:bg-gray-800"
                      onClick={() => handleResultClick(result)}
                    >
                      {result.type === "story" ? (
                        <span>📖 {result.title}</span>
                      ) : (
                        <span>👤 {result.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-300 hover:text-[#D4AF37] px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
                <Link to="/write" className="text-gray-300 hover:text-[#D4AF37] px-3 py-2 rounded-md text-sm font-medium">
                  Write Story
                </Link>
                <Link to="/library" className="text-gray-300 hover:text-[#D4AF37] px-3 py-2 rounded-md text-sm font-medium">
                  Library
                </Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-[#D4AF37] px-3 py-2 rounded-md text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-[#D4AF37] px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-[#D4AF37] hover:bg-[#C4A137] ml-3"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <CiMenuBurger className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, tags, or authors"
                className="block w-full pl-3 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm"
              />
            </form>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-300 hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </Link>
                <Link to="/write" className="text-gray-300 hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">
                  Write Story
                </Link>
                <Link to="/library" className="text-gray-300 hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">
                  Library
                </Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-black bg-[#D4AF37] hover:bg-[#C4A137]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
