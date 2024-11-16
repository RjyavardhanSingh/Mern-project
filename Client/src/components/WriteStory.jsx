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
      const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
      const response = await fetch('http://localhost:5000/stories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token}`, // Pass the token to authenticate the user
        },
        body: JSON.stringify({ 
          title, 
          content, 
          tags: tags.split(',').map(tag => tag.trim()) // Convert tags into an array
        }), 
      });
  
      if (response.ok) {
        alert('Story submitted successfully!');
        navigate('/profile'); // Redirect to the profile page after success
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit the story. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };
  
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1697029749544-ffa7f15f9dd0?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2slMjBhZXN0aGV0aWN8ZW58MHx8MHx8fDA%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#A67C52",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#4B2E1A] opacity-50"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl text-center py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#F5F3EF] font-cursive">Write Your Story</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <label htmlFor="title" className="block font-semibold mb-2 text-[#4B2E1A]">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="content" className="block font-semibold mb-2 text-[#4B2E1A]">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="6"
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <label htmlFor="tags" className="block font-semibold mb-2 text-[#4B2E1A]">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-[#4B2E1A] text-[#F5F3EF] p-2 rounded-lg shadow-md hover:bg-[#8C4D2E] font-semibold transition-all"
          >
            Submit Story
          </button>
        </form>
      </div>
    </div>
  );
}

export default WriteStory;
