import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState([]);
  const [stories, setStories] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

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
          setInterests(data.user.interests || []);
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
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    const data = { name, email, bio };

    try {
      const response = await fetch('http://localhost:5000/profiles', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Profile updated successfully!');
        setName(data.user.name);
        setEmail(data.user.email);
        setBio(data.user.bio);
        navigate('/profile');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error during profile update:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleDeleteProfile = async () => {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');

    try {
      const response = await fetch('http://localhost:5000/delete-profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Profile deleted successfully!');
        navigate('/');
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete profile.');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('An error occurred while deleting the profile.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F4E1D2] p-6">
      <h2 className="text-3xl font-bold text-[#7B503B] mb-6">Profile Settings</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-[#EBD5C3] p-6 shadow-lg rounded-lg mb-6 w-full">
        <div className="flex justify-between items-start">
          <h3 className="text-4xl font-bold text-[#5F4C40]">{name}</h3>
        </div>
        <p className="text-[#7B503B]">{email}</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <p className="text-[#5F4C40] mt-2">{bio || 'No bio provided.'}</p>
          </div>
          <div className="col-span-1 text-center">
            <p className="text-[#5F4C40]">Contact me on</p>
            <p className="text-[#7B503B]">{email}</p>
          </div>
          <div className="col-span-1 text-center">
            <p className="text-[#5F4C40]">Interests</p>
            <ul className="text-[#7B503B]">
              {interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => setShowUpdateForm(!showUpdateForm)}
          className={`mt-4 ${showUpdateForm ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold px-4 py-2 rounded`}
        >
          {showUpdateForm ? 'Cancel' : 'Update Profile'}
        </button>
      </div>

      {showUpdateForm && (
        <form
          onSubmit={handleUpdate}
          className="bg-[#EBD5C3] p-6 shadow-lg rounded-lg w-full"
        >
          <label htmlFor="name" className="block font-medium mb-2 text-[#5F4C40]">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-[#D3B8A4] rounded focus:outline-none focus:ring-2 focus:ring-[#A77E64] mb-4"
          />

          <label htmlFor="email" className="block font-medium mb-2 text-[#5F4C40]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-[#D3B8A4] rounded focus:outline-none focus:ring-2 focus:ring-[#A77E64] mb-4"
          />

          <label htmlFor="bio" className="block font-medium mb-2 text-[#5F4C40]">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border border-[#D3B8A4] rounded focus:outline-none focus:ring-2 focus:ring-[#A77E64] mb-4"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleDeleteProfile}
            className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded mt-4"
          >
            Delete Profile
          </button>
        </form>
      )}

      <h3 className="text-2xl font-bold text-[#7B503B] mt-8">Your Stories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 w-full">
        {stories.map((story) => (
          <div
            key={story._id}
            className="bg-[#EBD5C3] p-4 shadow-lg rounded-lg hover:shadow-xl transition duration-200"
          >
            <h4 className="text-lg font-semibold text-[#5F4C40]">{story.title}</h4>
            <p className="text-sm text-[#7B503B] mb-2">By {name}</p>
            <p className="text-[#5F4C40]">
              {story.content.length > 100
                ? `${story.content.substring(0, 100)}...`
                : story.content}
              <a
                href={`/stories/${story._id}`}
                className="text-black hover:underline"
              >
                {' '}
                Read more
              </a>
            </p>
            <button
              onClick={() => navigate(`/edit-story/${story._id}`)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
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
