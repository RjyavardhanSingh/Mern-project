import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>
      {likedStories.length === 0 ? (
        <p className="text-gray-600">No liked stories yet. Start liking stories to add them here!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedStories.map((story) => (
            <div key={story._id} className="bg-white shadow-md p-4 rounded">
              <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
              <p className="text-gray-700">{story.content.substring(0, 100)}...</p>
              <Link to={`/stories/${story._id}`} className="text-blue-500 mt-2 block">
                Read full story
              </Link>
              <button
                className="mt-4 bg-red-500 text-white p-2 rounded"
                onClick={() => handleLikeUnlike(story._id, story.isLiked)}
              >
                {story.isLiked ? 'Unlike' : 'Like'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
