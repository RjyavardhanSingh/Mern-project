import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function StoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('User is not authenticated');
        }

        const response = await fetch(`http://localhost:5000/clicked/stories/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }

        const data = await response.json();
        setStory(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching story:', error);
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return <p>Loading story...</p>;
  }

  if (!story) {
    return <p>Story not found.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
      <p className="text-sm text-gray-600 mb-4">By {story.author?.name || 'Unknown Author'}</p>
      <p className="text-lg text-gray-800">{story.content}</p>
    </div>
  );
}

export default StoryDetails;
