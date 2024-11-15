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
    try {
      const response = await fetch(`http://localhost:5000/stories/${storyId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like story');
      }

      const result = await response.json();
      console.log('Story liked:', result);

      // Update the state to reflect the like action
      setFeed(prevFeed =>
        prevFeed.map(story =>
          story._id === storyId ? { ...story, likeCount: result.likesCount } : story
        )
      );
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

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
          <div>
            <button
              onClick={() => navigate('/write')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold mb-12"
            >
              What's Your Story?
            </button>

            {/* Feed display for logged-in users */}
            {loading ? (
              <p className="text-lg text-gray-700">Loading feed...</p>
            ) : feed.length === 0 ? (
              <p className="text-lg text-gray-700">No stories to show based on your interests yet.</p>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Personalized Feed</h2>
                <div className="space-y-4">
                  {feed.map((story) => (
                    <div key={story._id} className="bg-white p-4 rounded shadow-md">
                      <h3 className="text-xl font-semibold text-gray-900">{story.title}</h3>
                      <p className="text-gray-700">{story.content.substring(0, 200)}...</p>
                      <p className="text-sm text-gray-600">By {story.author.name}</p>
                      <p className="text-sm text-gray-500">Tags: {story.tags.join(', ')}</p>

                      {/* Like button */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleLike(story._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ❤️ Like
                        </button>
                        <span className="text-sm text-gray-600">{story.likeCount} Likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
