import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        onLogin(data.token);
        alert(data.message || 'Login successful!');
        navigate('/');
        window.location.reload();
      } else {
        throw new Error('Token not received from server');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col md:flex-row items-center justify-center px-6 py-8">
      <div className="md:w-1/2 max-w-md mb-8 md:mb-0 md:mr-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome Back</h1>
        <p className="text-xl text-gray-600">Dive into a world of stories. Your next adventure awaits.</p>
      </div>
      
      <div className="w-full md:w-1/2 max-w-md">
        <form onSubmit={handleLogin} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Login</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

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

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <span 
            className="text-orange-500 hover:text-orange-800 cursor-pointer font-bold" 
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;