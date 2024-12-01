import React, { useState } from 'react';
import { signIn } from '../../server/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while making the request

    try {
      const response = await signIn({ email, password }); // Call the signIn function

      if (response) {
        console.log('data:', response.data.result);
        
        setSuccess('Login successful!');

        navigate('/home')
        
        // Handle successful login (e.g., redirect or store token)
        // Example: localStorage.setItem('token', data.token);
      } else {
        setError(response?.message || 'An error occurred');
      }
    } catch (error) {
      setError('There was an error logging in!');
    } finally {
      setLoading(false); // Set loading to false after request completion
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Login</h2>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className='mb-6 text-md'>Already have an account? <Link className='italic' to='/sign-up'>Sign Up</Link></div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Error or Success Message */}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mt-4 text-green-500 text-center">{success}</div>}
      </div>
    </div>
  );
};

export default Login;
