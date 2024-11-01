import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    
    const hardcodedEmail = 'hello@gmail.com';
    const hardcodedPassword = 'hello';

    if (email === hardcodedEmail && password === hardcodedPassword) {
      alert('Login successful!');
      onLogin(); 
      navigate('/'); 
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label htmlFor="email" className="block font-semibold mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="password" className="block font-semibold mb-2">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold"
        >
          Login
        </button>

        <div className="mt-4">
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-500 hover:underline"
          >
            No account? Sign up here.
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
