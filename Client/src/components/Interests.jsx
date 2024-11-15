// src/components/Interests.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();

  const genres = ['Horror', 'Anime', 'Comedy', 'Drama', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Adventure'];

  // Retrieve userId from localStorage
  const userId = localStorage.getItem('userId');

  // Use useEffect to navigate if userId is missing
  useEffect(() => {
    if (!userId) {
      navigate('/signup');
    }
  }, [userId, navigate]);

  // Handle interest selection
  const handleSelect = (genre) => {
    if (selectedInterests.includes(genre)) {
      setSelectedInterests(selectedInterests.filter(item => item !== genre));
    } else {
      setSelectedInterests([...selectedInterests, genre]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const interestsData = {
      interests: selectedInterests,  // Array of selected interests
      userId: userId,  // Use the userId from localStorage
    };

    console.log('Interests data being sent:', interestsData);

    try {
      const response = await fetch('http://localhost:5000/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interestsData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Interests submitted:', result);
        // Optionally, navigate to another page (e.g., dashboard) after submission
        navigate(`/login`);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Select Your Interests</h2>
      <div className="grid grid-cols-2 gap-4">
        {genres.map((genre, index) => (
          <button
            key={index}
            onClick={() => handleSelect(genre)}
            className={`p-2 border rounded ${selectedInterests.includes(genre) ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {genre}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white p-2 rounded">
        Submit Interests
      </button>
    </div>
  );
};

export default Interests;
