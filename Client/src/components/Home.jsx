import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      setIsLoggedIn(true)
    }
  },[])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to StoryWriting Platform</h1>
        <p className="text-lg text-gray-700 mb-8">
          Dive into a world of creativity and storytelling! Whether you’re here to share your stories
          or explore narratives from other writers, this platform is designed just for you.
        </p>
        
        {!isLoggedIn ? (
          <div className="flex gap-4 mb-12">
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
              Login
            </Link>
            <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold">
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            onClick={() => navigate('/write')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold mb-12"
          >
            Whats Your Story
          </button>

          
        )}
      </section>

    </div>
  );
}

export default Home;
