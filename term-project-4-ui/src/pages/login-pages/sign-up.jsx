import React, { useState } from 'react';
import { signUp } from '../../server/api'; // Assume you have an API function for sign-up

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    password: '',
    confirm_password: '',
    contact: '',
    profile_picture: null, // Updated to handle file
    user_name: '',
    birthdate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_picture: file })); // Store file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Prepare FormData for file upload
      const uploadData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          uploadData.append(key, formData[key]);
        }
      });

      const data = await signUp(uploadData); // Send FormData to the API

      if (data && data.verified) {
        setSuccess('Sign-up successful! Redirecting...');
        localStorage.setItem('token', data.result.token);
      } else {
        setError(data?.message || 'An error occurred during sign-up.');
      }
    } catch (err) {
      setError('There was an error during sign-up.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Sign Up</h2>

        <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700">
              First Name:
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700">
              Last Name:
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label htmlFor="contact" className="block text-sm font-semibold text-gray-700">
              Contact:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Other fields... */}

          {/* Profile Picture */}
          <div className="mb-4">
            <label htmlFor="profile_picture" className="block text-sm font-semibold text-gray-700">
              Profile Picture:
            </label>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Optional: Display Profile Picture Preview */}
          {formData.profile_picture && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(formData.profile_picture)}
                alt="Profile Preview"
                className="w-24 h-24 object-cover rounded-full border"
              />
            </div>
          )}


           {/* Username */}
           <div className="mb-4">
            <label htmlFor="user_name" className="block text-sm font-semibold text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Birthdate */}
          <div className="mb-6">
            <label htmlFor="birthdate" className="block text-sm font-semibold text-gray-700">
              Birthdate:
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Error or Success Messages */}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mt-4 text-green-500 text-center">{success}</div>}
      </div>
    </div>
  );
};

export default SignUp;
