import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Booking from "./bookings/Booking";
import Create from "./pages/Creates";
import Home from "./pages/Dashboard";
import Hosted from "./pages/Hosted";
import Landing from "./pages/landing";
import Login from "./pages/Login";
import Messages from "./main/messages";
import Notification from "./pages/notification";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";
import Profile from "./pages/Account";
import Account from "./main/profile";
import Adminlayout from "./components/layout/Navbar-layout";
import { useDispatch, useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";
import { setUserInfo } from "./redux/slice/auth";
import axiosInstance from "./utils/axios-instance";
import { Analytics } from "./pages/analyics";
import Dashboard from "./pages/Dashboard";
import Scan from "./main/scan";

const PrivateRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/home" /> : children;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const getUser  = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/auth/profile", { withCredentials: true });
        if (response.status === 200 && response.data.id) {
          dispatch(setUserInfo(response.data));
        } else {
          dispatch(setUserInfo(undefined));
        }
      } catch (error) {
        dispatch(setUserInfo(undefined));
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUser ();
    }
  }, [userInfo, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Circles height="50" width="50" color="#4fa94d" ariaLabel="loading" visible={true} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />

        <Route element={<Adminlayout />}>
          <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><Create /></PrivateRoute>} />
          <Route path="/hosted" element={<PrivateRoute><Hosted /></PrivateRoute>} />
          <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route path="/notification" element={<PrivateRoute><Notification /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/scan" element={<PrivateRoute><Scan /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="*" element={<PrivateRoute><Login /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;