import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
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
    } else {
      setLoading(false);
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
      setLikedStories((prev) => ({ ...prev, [storyId]: true }));

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

      setFeed((prevFeed) =>
        prevFeed.map((story) =>
          story._id === storyId
            ? { ...story, likeCount: story.likeCount + 1 }
            : story
        )
      );

      setTimeout(() => {
        setLikedStories((prev) => ({ ...prev, [storyId]: false }));
      }, 1000);
    } catch (error) {
      console.error('Error liking story:', error);
      setLikedStories((prev) => ({ ...prev, [storyId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {!isLoggedIn ? (
        <div className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#D4AF37] to-transparent opacity-20" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-[#D4AF37] to-transparent opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#D4AF37] mb-6">
                  Welcome to StoryWrite
                </h1>
                <p className="mt-3 text-xl text-gray-300 sm:mt-4 mb-8">
                  Join the world's largest storytelling community where stories come to life. 
                  Discover, create, and share captivating tales with millions of readers and writers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-black bg-[#D4AF37] hover:bg-[#C4A137] transition duration-300"
                  >
                    Start Reading
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#D4AF37] text-base font-medium rounded-full text-[#D4AF37] bg-transparent hover:bg-[#D4AF37] hover:text-black transition duration-300"
                  >
                    Start Writing
                  </Link>
                </div>
              </div>
              <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                <img
                  src="/storyapp.jpg"
                  alt="App screenshot"
                  className="rounded-xl shadow-xl ring-1 ring-[#D4AF37] ring-opacity-20"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/write')}
            className="bg-[#D4AF37] text-black px-8 py-3 rounded-full hover:bg-[#C4A137] font-medium mb-12 transition duration-300 block mx-auto"
          >
            What's Your Story?
          </button>
          {loading ? (
            <p className="text-lg text-gray-400 text-center">Loading stories...</p>
          ) : feed.length === 0 ? (
            <p className="text-lg text-gray-400 text-center">No stories to show based on your interests yet.</p>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-[#D4AF37] mb-8 text-center">Your Personalized Feed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {feed.map((story) => (
                  <div
                    key={story._id}
                    className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer border border-gray-700"
                    onClick={() => navigate(`/stories/${story._id}`)}
                  >
                    <div className="h-48 bg-gray-700 relative">
                      <img
                        src={story.coverImage || '/placeholder.svg?height=192&width=384'}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                        <h3 className="text-xl font-semibold text-white line-clamp-2">{story.title}</h3>
                        <p className="text-sm text-gray-300">By {story.author?.name || 'Unknown Author'}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{story.content}</p>
                      <p className="text-xs text-gray-500 mb-3">Tags: {story.tags.join(', ')}</p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(story._id);
                          }}
                          className={`flex items-center gap-1 text-[#D4AF37] hover:text-[#C4A137] transition duration-300 ${
                            likedStories[story._id] ? 'scale-110' : ''
                          }`}
                        >
                          <span>❤️</span>
                          <span className="text-sm font-medium">Like</span>
                        </button>
                        <span className="text-sm text-gray-400">{story.likeCount} Likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
