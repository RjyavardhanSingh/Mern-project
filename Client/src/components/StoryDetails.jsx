import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/api';

function StoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not authenticated');
        }

        const response = await fetch(API_ENDPOINTS.STORY_BY_ID(id), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
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
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-[#D4AF37] text-2xl font-semibold">Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-[#D4AF37] text-2xl font-semibold">Story not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-[#D4AF37]">{story.title}</h1>
            <p className="text-sm text-gray-400 mb-6">
              By {story.author?.name || 'Unknown Author'}
            </p>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-gray-300">{story.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryDetails;