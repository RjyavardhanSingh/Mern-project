import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
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
    console.log("Search Query:", searchQuery); // Check if query is valid
    if (searchQuery.trim()) {
        try {
            const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const results = await response.json();
                setSearchResults(results);
                setShowResults(true);
            } else {
                console.error('Error fetching search results:', response.statusText);
            }
        } catch (error) {
            console.error('Error performing search:', error);
        }
    }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    if (result.type === "story") {
      // Navigate to story details page
      navigate(`/stories/${result.id}`);
    } 
  };

  return (
    <nav className="bg-blue-600 p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-lg">
          Story Writing Platform
        </Link>
        <div className="relative">
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
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 bg-white shadow-lg rounded-md w-full max-h-60 overflow-y-auto z-10">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
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
