import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from '../utils/axios-instance';
import { setUserInfo } from "../redux/slice/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = ({ className, ...props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserInfo(res.data.user));

      if (res.data.user.id) {
        navigate(res.data.user.profileSetup ? "/home" : "/profile");
      }
    } catch (err) {
      setError(err?.response?.data || "Login failed. Please try again.");
    }finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <>
      <form className={cn("flex flex-col gap-6", className)} onSubmit={handleLogin} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to login to your account</p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && error.toLowerCase().includes("email") && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && error.toLowerCase().includes("password") && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? ( <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
              />
            </svg>) : "Login"}</Button>
          {error && !error.toLowerCase().includes("email") && !error.toLowerCase().includes("password") && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
      </form>

      <Button variant="outline" className="w-full mt-5" onClick={handleGoogleSignup}>
        <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google Logo" className="mr-2" />
        Login with Google
      </Button>

      <div className="text-center text-sm mt-5">
        Don&apos;t have an account? <a href="/signup" className="underline underline-offset-4">Sign up</a>
      </div>
    </>
  );
};

export default LoginForm;
