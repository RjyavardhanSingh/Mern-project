import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = false; // Replace with actual login check logic

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
            Write a Story
          </button>
        )}
      </section>

      <section className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Personalized Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example stories - replace with dynamic content from API */}
          <div className="p-4 bg-white rounded shadow hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-600">Story Title 1</h3>
            <p className="text-gray-600">A brief description of the story...</p>
            <Link to="/story/1" className="text-blue-500 hover:underline mt-2 block">
              Read More
            </Link>
          </div>
          <div className="p-4 bg-white rounded shadow hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-600">Story Title 2</h3>
            <p className="text-gray-600">A brief description of the story...</p>
            <Link to="/story/2" className="text-blue-500 hover:underline mt-2 block">
              Read More
            </Link>
          </div>
          
        </div>
      </section>
    </div>
  );
}

export default Home;
