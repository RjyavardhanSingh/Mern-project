import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // To preview the image before upload
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
          setBio(data.user.bio);
          setProfilePicture(data.user.profilePicture); // Set the initial profile picture
          setStories(data.stories);
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
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const response = await fetch('http://localhost:5000/profiles', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setShowUpdateForm(false);
        navigate('/profile');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  // Preview the selected image before uploading
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-brown-100 p-4 text-brown-900">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Profile Picture Display */}
      <img
        src={imagePreview || profilePicture || '/default-profile.png'}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4 border-2 border-brown-500"
      />

      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-md italic mb-4">{bio || 'No bio available'}</p>

      {/* Button to Show/Hide Update Form */}
      <button
        onClick={() => setShowUpdateForm(!showUpdateForm)}
        className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-700"
      >
        {showUpdateForm ? 'Cancel' : 'Update Profile'}
      </button>

      {/* Update Profile Form */}
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

          <label htmlFor="bio" className="block font-semibold mb-2">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="profilePicture" className="block font-semibold mb-2">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 font-semibold"
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
