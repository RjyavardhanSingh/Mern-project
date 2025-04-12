import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/api';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, bio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('userId', data.userId);
      alert(data.message);
      navigate('/interests');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col md:flex-row items-center justify-center px-6 py-8">
      <div className="md:w-1/2 max-w-md mb-8 md:mb-0 md:mr-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Join the Community</h1>
        <p className="text-xl text-gray-600">Create your account and start exploring amazing stories.</p>
      </div>

      <div className="w-full md:w-1/2 max-w-md">
        <form onSubmit={handleSignup} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Sign Up</h2>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tell us something about yourself"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 w-full"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <span
            className="text-orange-500 hover:text-orange-800 cursor-pointer font-bold"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
