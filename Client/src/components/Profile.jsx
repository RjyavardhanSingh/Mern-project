import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [stories, setStories] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
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
          setBio(data.user.bio || '');
          setStories(data.stories || []);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch profile.');
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
  
    const token = localStorage.getItem('token');
    const data = {
      name,
      email,
      bio,
    };
  
    try {
      const response = await fetch('http://localhost:5000/profiles', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',  // Set content type to application/json
        },
        body: JSON.stringify(data),  // Send the data as JSON
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Profile updated successfully!');
  
        // Update the local state with the new user data
        setName(data.user.name);
        setEmail(data.user.email);
        setBio(data.user.bio);
  
        navigate('/profile'); // Redirect to profile page after update
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error during profile update:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h3 className="text-xl font-semibold mb-4">{name}</h3>

      <button
        onClick={() => setShowUpdateForm(!showUpdateForm)}
        className="bg-blue-600 text-white p-2 rounded mb-4"
      >
        {showUpdateForm ? 'Cancel' : 'Update Profile'}
      </button>

      {showUpdateForm && (
        <form
          onSubmit={handleUpdate}
          className="bg-white p-8 rounded shadow-md max-w-md w-full mb-4"
        >
          <label htmlFor="name" className="block font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="email" className="block font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="bio" className="block font-semibold mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

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
            <p className="text-sm text-gray-600 mb-2">By {name}</p>
            <p className="text-gray-700">
              {story.content.length > 100
                ? `${story.content.substring(0, 100)}...`
                : story.content}
              <a href={`/stories/${story._id}`} className="text-blue-500">
                {' '}
                Read more
              </a>
            </p>
            {/* Add Edit button */}
            <button
              onClick={() => navigate(`/edit-story/${story._id}`)}
              className="mt-2 text-white bg-yellow-500 hover:bg-yellow-600 p-2 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
