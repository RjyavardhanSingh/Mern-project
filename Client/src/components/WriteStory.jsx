import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WriteStory() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/stories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags: tags.split(',').map(tag => tag.trim()) }), 
      });
  
      if (response.ok) {
        alert('Story submitted successfully!');
        navigate('/profile');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit the story. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Write Your Story</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label htmlFor="title" className="block font-semibold mb-2">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="content" className="block font-semibold mb-2">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="6"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <label htmlFor="tags" className="block font-semibold mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold"
        >
          Submit Story
        </button>
      </form>
    </div>
  );
}

export default WriteStory;
