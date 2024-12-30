import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const token = localStorage.getItem('token');
  
    useEffect(() => {
      if (token) {
        navigate('/home'); 
        return;
      }
    }, [navigate, token]);
    
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    const validatePassword = (password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      return passwordRegex.test(password);
    };
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      if (!email) {
        setError('Please fill in both email.');
        return;
      }
      if (!password) {
        setError('Please fill in both password.');
        return;
      }

      if (!validateEmail(email)) return setError('Please enter a valid email address.');
    if (!validatePassword(password)) {
      return setError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
    }
  
      setError(''); 
  
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          email,
          password,
        });
  
        const { token } = response.data; 
  
        if (token) {
          localStorage.setItem('token', token); 
          navigate('/home'); 
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Login failed. Please try again.'); 
        console.error('Login error:', err); 
      }
    };
    const handleGoogleSignup = () => {
      window.location.href = 'http://localhost:5000/auth/google';
    };
  
  
  return (
    <div className="flex h-screen w-screen">
  
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-indigo-900 to-purple-600 items-center justify-center">
        <img
          src="https://via.placeholder.com/600x600" 
          alt="Illustration"
          className="w-3/4 h-auto"
        />
      </div>

  
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-96 max-w-full mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
            Sign In
          </h2>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

   
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}   
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              >
                Hide
              </button>
            </div>
          </div>
          
   
          <div className="flex justify-end mb-4">
            <a href="#" className="text-sm text-indigo-500 hover:underline">
              Reset password
            </a>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}



          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            Sign In
          </button>


          <div className="flex items-center justify-center my-6">
            <hr className="w-1/4 border-gray-300" />
            <span className="mx-2 text-gray-400">OR</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

   
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
            Sign Up with Google
          </button>

          <p className="mt-6 text-xs text-gray-500 text-center">
            By continuing, you agree to the{" "}
            <a href="#" className="text-indigo-500 hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};


export default Login
