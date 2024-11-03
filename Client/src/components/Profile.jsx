import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [stories, setStories] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStories = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const response = await fetch('http://localhost:5000/profiles', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.user.name);
          setEmail(data.user.email);
          setStories(data.stories); 
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch profile.');
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchUserStories();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token'); 

    try {
      const response = await fetch('http://localhost:5000/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ email, name }), 
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        navigate('/profile');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={() => setShowUpdateForm(!showUpdateForm)}
        className="bg-blue-600 text-white p-2 rounded mb-4"
      >
        {showUpdateForm ? 'Cancel' : 'Update Profile'}
      </button>

      {showUpdateForm && (
        <form onSubmit={handleUpdate} className="bg-white p-8 rounded shadow-md max-w-md w-full mb-4">
          <label htmlFor="name" className="block font-semibold mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="email" className="block font-semibold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="password" className="block font-semibold mb-2">Password (leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold"
          >
            Update Profile
          </button>
        </form>
      )}

      <h3 className="text-xl font-bold mb-4">Your Stories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {stories.map((story) => (
          <div key={story._id} className="bg-white p-4 rounded shadow-md">
            <h4 className="font-semibold text-lg">{story.title}</h4>
            <p className="text-sm text-gray-600 mb-2">By {story.author.name}</p>
            <p className="text-gray-700">
              {story.content.length > 100
                ? `${story.content.substring(0, 100)}...`
                : story.content}
              <a href={`/stories/${story._id}`} className="text-blue-500"> Read more</a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
