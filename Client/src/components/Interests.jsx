import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Interests() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();
  const genres = ['Horror', 'Anime', 'Comedy', 'Drama', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Adventure'];

  const handleSelect = (genre) => {
    if (selectedInterests.includes(genre)) {
      setSelectedInterests(selectedInterests.filter(item => item !== genre));
    } else {
      setSelectedInterests([...selectedInterests, genre]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/profiles/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      if (response.ok) {
        alert('Interests saved successfully');
        navigate('/');
      } else {
        alert('Failed to save interests');
      }
    } catch (error) {
      console.error('Error saving interests:', error);
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
      <button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white p-2 rounded">Submit Interests</button>
    </div>
  );
}

export default Interests;
