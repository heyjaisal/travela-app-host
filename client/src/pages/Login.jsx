import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserRole } from "../redux/Action";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("token");
    const queryRole = params.get("role");

    if (queryToken && queryRole) {
      localStorage.setItem("token", queryToken);
      dispatch(setUserRole(queryRole));
      navigate("/home", { replace: true });
    } else if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [navigate, dispatch]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let temperror = {};
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
    if (!formData.email) {
      temperror.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      temperror.email = "Enter a valid email address";
    }
  
    if (!formData.password) {
      temperror.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      temperror.password = "Password must be at least 8 characters long and contain at least one letter and one number";
    }
  
    setError(temperror);
    return Object.keys(temperror).length === 0;
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    if(validate()){
      setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, role } = response.data;

      dispatch(setUserRole(role));

      if (token) {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
    }

  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
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
              onChange={(e) => setEmail(e.target.value)}
            />
             {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          <div className="mb-6">
          <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
               {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
               <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <a href="#" className="text-sm text-indigo-500 hover:underline">
              Reset password
            </a>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

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

export default Login;
