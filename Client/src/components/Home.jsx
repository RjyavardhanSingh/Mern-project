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
      fetchFeed(token); // Fetch the feed if logged in
    }
  }, []);

  const fetchFeed = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/feeds', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      const data = await response.json();
      const updatedFeed = data.map((story) => ({
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

  const handleLike = async (storyId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <section className="text-center max-w-3xl px-4">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">Welcome to StoryWriting Platform</h1>
        <p className="text-lg text-gray-700 mb-8">
          Dive into a world of creativity and storytelling! Whether you’re here to share your stories
          or explore narratives from other writers, this platform is designed just for you.
        </p>

        {!isLoggedIn ? (
          <div className="flex gap-6 justify-center mb-12">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition duration-300">
              Login
            </Link>
            <Link to="/signup" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition duration-300">
              Sign Up
            </Link>
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate('/write')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold mb-12 transition duration-300"
            >
              What's Your Story?
            </button>

            {loading ? (
              <p className="text-lg text-gray-700">Loading feed...</p>
            ) : feed.length === 0 ? (
              <p className="text-lg text-gray-700">No stories to show based on your interests yet.</p>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-blue-600 mb-6">Your Personalized Feed</h2>
                <div className="space-y-6">
                  {feed.map((story) => (
                    <div
                      key={story._id}
                      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
                      onClick={() => navigate(`/stories/${story._id}`)}
                    >
                      <h3 className="text-2xl font-semibold text-gray-900">{story.title}</h3>
                      <p className="text-gray-700 mt-2">{story.content.substring(0, 200)}...</p>
                      <p className="text-sm text-gray-600 mt-2">By {story.author?.name || 'Unknown Author'}</p>
                      <p className="text-sm text-gray-500 mt-1">Tags: {story.tags.join(', ')}</p>

                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigating on like button click
                            handleLike(story._id);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
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
