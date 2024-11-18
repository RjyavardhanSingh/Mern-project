import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Book, ChevronRight } from 'lucide-react';

const Library = () => {
  const [likedStories, setLikedStories] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLikedStories = async () => {
      if (!userId || !token) {
        console.error('User ID or Token missing');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/stories/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch liked stories');
        }

        const data = await response.json();
        const storiesWithLikedStatus = data.map(story => ({
          ...story,
          isLiked: true
        }));

        setLikedStories(storiesWithLikedStatus);
      } catch (error) {
        console.error('Error fetching liked stories:', error);
      }
    };

    fetchLikedStories();
  }, [userId, token]);

  const handleLikeUnlike = async (storyId, isLiked) => {
    if (!token || !userId) {
      console.error('Token or User ID missing');
      return;
    }
  
    try {
      const url = `http://localhost:5000/stories/${storyId}/like`;
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
  
      if (!response.ok) {
        throw new Error(isLiked ? 'Failed to unlike story' : 'Failed to like story');
      }
  
      const data = await response.json();
      console.log(isLiked ? 'Story unliked' : 'Story liked', data);
  
      if (isLiked) {
        setLikedStories(prevStories => prevStories.filter(story => story._id !== storyId));
      } else {
        const updatedStory = await fetch(`http://localhost:5000/stories/${storyId}`).then(res => res.json());
        setLikedStories(prevStories => [...prevStories, updatedStory]);
      }
    } catch (error) {
      console.error('Error liking/unliking story:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Your Library</h1>
        {likedStories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Book className="mx-auto h-12 w-12 text-orange-500 mb-4" />
            <p className="text-xl text-gray-600">Your library is empty. Start liking stories to add them here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedStories.map((story) => (
              <div key={story._id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">{story.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{story.content}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/stories/${story._id}`} 
                      className="inline-flex items-center text-orange-500 hover:text-orange-600 transition duration-300 ease-in-out"
                    >
                      Read full story
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                    <button
                      className={`flex items-center justify-center p-2 rounded-full transition duration-300 ease-in-out ${
                        story.isLiked 
                          ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      onClick={() => handleLikeUnlike(story._id, story.isLiked)}
                    >
                      <Heart className={`h-5 w-5 ${story.isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;