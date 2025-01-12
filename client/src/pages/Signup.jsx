import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    cpassword: '',
    otp: '',
  });
  const [error, setError] = useState({});
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateFeilds = () => {
    let temperror = {};

    const usernameRegex = /^[a-zA-Z0-9\-]+$/;

    if (!formData.username) {
      temperror.username = "User name is required";
    } else if (!usernameRegex.test(formData.username)) {
      temperror.username = "Username only contains numbers, alphabets, and '-' (No spaces or special characters)";
    }
    if (!formData.email) {
      temperror.email = "Email is required";
    }
    if (!formData.password) {
      temperror.password = "Password is required";
    }
    if (!formData.cpassword) {
      temperror.cpassword = "Confirm your password";
    } else if (formData.password !== formData.cpassword) {
      temperror.cpassword = "Passwords do not match";
    }
    if (!formData.otp) {
      temperror.otp = "Enter your OTP";
    }
    setError(temperror);
    return Object.keys(temperror).length === 0;
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (validateFeilds()) {
      try {
        await axios.post('http://localhost:5000/api/send-otp', { email: formData.email });
        setShowOtpPopup(true);
        setError({});
      } catch (err) {
        setError({ general: 'Failed to send OTP. Please try again.' });
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', formData);
      if (response.status === 201) {
        navigate('/login');
      }
      setShowOtpPopup(false);
    } catch (error) {
      setError({ otp: 'Invalid OTP.' });
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google"; // Redirect user to your backend for Google OAuth
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-indigo-900 to-purple-600 items-center justify-center">
        <img
          src="https://via.placeholder.com/600x600"
          alt="Signup Illustration"
          className="w-3/4 h-auto"
        />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form onSubmit={handleSendOtp} className="w-96 max-w-full mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-700 text-center mb-4">Create Account</h2>

          {/* Render each specific error message under each input */}
          <div className="mb-3">
            <label htmlFor="username" className="block text-gray-600 mb-2">Name</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              autoComplete="username"
            />
            {error.username && (
              <p className="text-red-500 text-sm mt-1">{error.username}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              autoComplete="email"
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              autoComplete="new-password"
            />
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="cpassword" className="block text-gray-600 mb-2">Confirm Password</label>
            <input
              id="cpassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.cpassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              autoComplete="new-password"
            />
            {error.cpassword && (
              <p className="text-red-500 text-sm mt-1">{error.cpassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400"
          >
            Send OTP
          </button>

          <div className="flex items-center justify-center my-4">
            <hr className="w-1/4 border-gray-300" />
            <span className="mx-2 text-gray-400">OR</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          {/* Google SignUp/Login Button */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
          >
            <img
              src="https://img.icons8.com/color/24/000000/google-logo.png"
              alt="Google Logo"
              className="mr-2"
            />
            Sign Up / Login with Google
          </button>
        </form>
      </div>

      {/* OTP Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-center">Enter OTP</h3>
            <input
              id="otp"
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400"
              autoComplete="one-time-code"
            />
            {error.otp && (
              <p className="text-red-500 text-sm mt-1">{error.otp}</p>
            )}
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
