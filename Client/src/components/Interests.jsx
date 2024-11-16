import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();

  const genres = [
    'Horror', 'Anime', 'Comedy', 'Drama', 'Sci-Fi', 'Fantasy', 
    'Mystery', 'Romance', 'Thriller', 'Adventure'
  ];

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
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
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
        <h1 className="text-3xl font-bold mb-6 text-[#F5F3EF] font-cursive">Select Your Favorite Genres</h1>
        <p className="text-lg mb-8 text-[#F5F3EF] font-serif">
          Choose the genres you love, and we’ll tailor your experience just for you.
        </p>

        {/* Genre Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {genres.map((genre, index) => (
            <div
              key={index}
              onClick={() => handleSelect(genre)}
              className={`p-2 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${selectedInterests.includes(genre)
                ? "bg-[#8C4D2E] text-[#F5F3EF] opacity-90"
                : "bg-[#D2B48C] text-[#4B2E1A] opacity-70"} hover:scale-105`}
            >
              <h3 className="text-xl font-semibold mt-2 font-serif">{genre}</h3>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-8 px-6 py-2 bg-[#4B2E1A] text-[#F5F3EF] rounded-full shadow-lg font-medium hover:bg-[#8C4D2E] transition-all"
        >
          Save My Interests
        </button>
      </div>
    </div>
  );
};

export default Interests;