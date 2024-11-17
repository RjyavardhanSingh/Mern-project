import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedStories, setLikedStories] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchFeed(token);
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
        likeCount: (story.likes || []).length,
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
      setLikedStories(prev => ({ ...prev, [storyId]: true }));

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

      // Update the feed to reflect the new like count
      setFeed(prevFeed => prevFeed.map(story => 
        story._id === storyId 
          ? { ...story, likeCount: story.likeCount + 1 } 
          : story
      ));

      // Reset the like animation after 1 second
      setTimeout(() => {
        setLikedStories(prev => ({ ...prev, [storyId]: false }));
      }, 1000);
    } catch (error) {
      console.error('Error liking story:', error);
      setLikedStories(prev => ({ ...prev, [storyId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-4 text-center">Welcome to StoryWriting Platform</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Dive into a world of creativity and storytelling! Whether you're here to share your stories
          or explore narratives from other writers, this platform is designed just for you.
        </p>

        {!isLoggedIn ? (
          <div className="flex gap-6 justify-center mb-12">
            <Link to="/login" className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 font-semibold transition duration-300">
              Login
            </Link>
            <Link to="/signup" className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 font-semibold transition duration-300">
              Sign Up
            </Link>
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate('/write')}
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 font-semibold mb-12 transition duration-300 block mx-auto"
            >
              What's Your Story?
            </button>

            {loading ? (
              <p className="text-lg text-gray-700 text-center">Loading feed...</p>
            ) : feed.length === 0 ? (
              <p className="text-lg text-gray-700 text-center">No stories to show based on your interests yet.</p>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Your Personalized Feed</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {feed.map((story) => (
                    <div
                      key={story._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
                      onClick={() => navigate(`/stories/${story._id}`)}
                    >
                      <div className="h-48 bg-gray-300 relative">
                        <img
                          src={story.coverImage || '/placeholder.svg?height=192&width=384'}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <h3 className="text-xl font-semibold text-white">{story.title}</h3>
                          <p className="text-sm text-gray-300">By {story.author?.name || 'Unknown Author'}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700 text-sm mb-4">{story.content.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-500 mb-2">Tags: {story.tags.join(', ')}</p>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(story._id);
                            }}
                            className={`text-orange-500 hover:text-orange-700 transition duration-300 ${
                              likedStories[story._id] ? 'scale-125' : ''
                            }`}
                          >
                            ❤️ Like
                          </button>
                          <span className="text-sm text-gray-600">{story.likeCount} Likes</span>
                        </div>
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