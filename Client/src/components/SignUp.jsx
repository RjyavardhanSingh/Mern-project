import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState(''); // Added bio state
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/signup', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, bio }), // Send bio to the backend
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed'); 
      }
  
      // Save the user's userId in localStorage
      localStorage.setItem('userId', data.userId);
  
      alert(data.message); 
      navigate('/interests'); 
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed: ' + error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Info section on the left */}
      <div className="flex-1 bg-gray-200 flex flex-col justify-center items-center p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Join the Community</h1>
        <p className="text-lg text-gray-600">Sign up today to explore amazing stories and connect with others!</p>
      </div>

      {/* Signup form section on the right */}
      <div className="flex-1 flex items-center justify-center p-10">
        <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio Field */}
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-semibold mb-2">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us something about yourself"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold mb-4">
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
