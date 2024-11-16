import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditStory() {
  const [stories, setStories] = useState([]); // List of user's stories
  const [selectedStory, setSelectedStory] = useState(null); // Currently selected story for editing
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStories = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/stories/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStories(data.data); // Set the user's stories
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
    setSelectedStory(story); // Set the selected story for editing
  };

  const handleStoryUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://localhost:5000/stories/${selectedStory._id}`,
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Your Stories</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!selectedStory ? (
        <div className="w-full max-w-2xl">
          <h3 className="text-lg font-bold mb-2">Your Stories</h3>
          <ul className="bg-white p-4 rounded shadow-md">
            {stories.map((story) => (
              <li
                key={story._id}
                className="border-b p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleStorySelection(story)}
              >
                <strong>{story.title}</strong>
                <p className="text-sm text-gray-600">
                  {story.content.slice(0, 50)}...
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <form
          onSubmit={handleStoryUpdate}
          className="bg-white p-8 rounded shadow-md max-w-md w-full"
        >
          <label htmlFor="title" className="block font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={selectedStory.title}
            onChange={(e) =>
              setSelectedStory({ ...selectedStory, title: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="content" className="block font-semibold mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={selectedStory.content}
            onChange={(e) =>
              setSelectedStory({ ...selectedStory, content: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <label htmlFor="tags" className="block font-semibold mb-2">
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
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Update Story
          </button>

          <button
            type="button"
            onClick={() => setSelectedStory(null)} // Deselect the story
            className="w-full bg-gray-500 text-white p-2 mt-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default EditStory;
