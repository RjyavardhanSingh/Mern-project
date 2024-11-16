import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchFeed(token);  // Fetch the feed if logged in
    }
  }, []);

  // Fetch the feed for the logged-in user
  const fetchFeed = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/feeds', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }
  
      const data = await response.json();
      // Ensure that story.likes is always an array
      const updatedFeed = data.map(story => ({
        ...story,
        likeCount: (story.likes || []).length, // Ensure likes is always an array
      }));
      setFeed(updatedFeed);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feed:', error);
      setLoading(false);
    }
  };

  // Handle like button click
  const handleLike = async (storyId) => {
    const userId = localStorage.getItem('userId'); // Fetch the user ID from localStorage
    const token = localStorage.getItem('token'); // Fetch the token from localStorage
  
    try {
      const response = await fetch(`http://localhost:5000/stories/${storyId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to like story');
      }
  
      const data = await response.json();
      console.log('Story liked:', data);
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1697029749544-ffa7f15f9dd0?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2slMjBhZXN0aGV0aWN8ZW58MHx8MHx8fDA%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#A67C52",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#4B2E1A] opacity-50"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl text-center py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#F5F3EF] font-cursive">
          Welcome to StoryWriting Platform
        </h1>
        <p className="text-lg mb-8 text-[#F5F3EF] font-serif">
          Dive into a world of creativity and storytelling! Whether you’re here to share your stories or explore narratives from other writers, this platform is designed just for you.
        </p>

        {!isLoggedIn ? (
          <div className="flex gap-4 mb-12">
            <Link
              to="/login"
              className="bg-[#4B2E1A] text-[#F5F3EF] px-4 py-2 rounded hover:bg-[#8C4D2E] font-semibold"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#8C4D2E] text-[#F5F3EF] px-4 py-2 rounded hover:bg-[#4B2E1A] font-semibold"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate('/write')}
              className="bg-[#4B2E1A] text-[#F5F3EF] px-4 py-2 rounded hover:bg-[#8C4D2E] font-semibold mb-12"
            >
              What's Your Story?
            </button>

            {/* Feed display for logged-in users */}
            {loading ? (
              <p className="text-lg text-[#F5F3EF]">Loading feed...</p>
            ) : feed.length === 0 ? (
              <p className="text-lg text-[#F5F3EF]">No stories to show based on your interests yet.</p>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-[#F5F3EF] mb-4">Your Personalized Feed</h2>
                <div className="space-y-4">
                  {feed.map((story) => (
                    <div key={story._id} className="bg-[#D2B48C] p-4 rounded shadow-md">
                      <h3 className="text-xl font-semibold text-[#4B2E1A]">{story.title}</h3>
                      <p className="text-[#4B2E1A]">{story.content.substring(0, 200)}...</p>
                      <p className="text-sm text-[#4B2E1A]">By {story.author.name}</p>
                      <p className="text-sm text-[#4B2E1A]">Tags: {story.tags.join(', ')}</p>

                      {/* Like button */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleLike(story._id)}
                          className="text-[#4B2E1A] hover:text-[#8C4D2E]"
                        >
                          ❤️ Like
                        </button>
                        <span className="text-sm text-[#4B2E1A]">{story.likeCount} Likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
