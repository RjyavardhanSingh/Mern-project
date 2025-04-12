import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/api';

function EditStory() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStories = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(API_ENDPOINTS.USER_STORIES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStories(data.data);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch stories.');
        }
      } catch (error) {
        setError('An error occurred while fetching stories.');
      }
    };

    fetchUserStories();
  }, []);

  const handleStorySelection = (story) => {
    setSelectedStory(story);
  };

  const handleStoryUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        API_ENDPOINTS.STORY_BY_ID(selectedStory._id),
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: selectedStory.title,
            content: selectedStory.content,
            tags: selectedStory.tags,
          }),
        }
      );

      if (response.ok) {
        const updatedStory = await response.json();
        alert('Story updated successfully!');
        navigate(`/stories/${updatedStory.data._id}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update story.');
      }
    } catch (error) {
      setError('An error occurred while updating the story.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-8">Edit Your Stories</h1>
        {error && <p className="text-red-500 mb-4 p-4 bg-gray-800 rounded-lg">{error}</p>}

        {!selectedStory ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-[#D4AF37] mb-4">Your Stories</h2>
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition duration-300"
                  onClick={() => handleStorySelection(story)}
                >
                  <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                  <p className="text-gray-300 line-clamp-2">{story.content}</p>
                  <div className="mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-sm text-[#D4AF37]">Edit this story</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setSelectedStory(null)}
                className="mr-4 text-[#D4AF37] hover:text-[#C4A137] transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="text-2xl font-semibold text-[#D4AF37]">Editing: {selectedStory.title}</h2>
            </div>
            <form onSubmit={handleStoryUpdate} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={selectedStory.title}
                  onChange={(e) =>
                    setSelectedStory({ ...selectedStory, title: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={selectedStory.content}
                  onChange={(e) =>
                    setSelectedStory({ ...selectedStory, content: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] h-64"
                ></textarea>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={selectedStory.tags.join(', ')}
                  onChange={(e) =>
                    setSelectedStory({
                      ...selectedStory,
                      tags: e.target.value.split(',').map((tag) => tag.trim()),
                    })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#D4AF37] text-black p-2 rounded-md hover:bg-[#C4A137] transition duration-300"
                >
                  Update Story
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="flex-1 bg-gray-700 text-[#D4AF37] p-2 rounded-md hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditStory;