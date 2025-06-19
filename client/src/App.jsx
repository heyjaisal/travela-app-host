import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";
import { setUserInfo } from "./redux/slice/auth";
import axiosInstance from "./utils/axios-instance";
import Adminlayout from "./components/layout/Navbar-layout";

const Booking = lazy(() => import("./bookings/Booking"));
const Create = lazy(() => import("./pages/Creates"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Hosted = lazy(() => import("./pages/Hosted"));
const Login = lazy(() => import("./pages/Login"));
const Messages = lazy(() => import("./chat/chatpage"));
const Notification = lazy(() => import("./pages/notification"));
const Signup = lazy(() => import("./pages/Signup"));
const BookingDetials = lazy(() => import("./bookings/Booked-details"));
const PropertyPage = lazy(() => import("./property/property-page"));
const Eventpage = lazy(() => import("./event/event-page"));
const Payment = lazy(() => import("./pages/Payment"));
const Profile = lazy(() => import("./pages/Account"));
const Account = lazy(() => import("./main/profile"));
const Analytics = lazy(() => import("./pages/analyics"));
const Scan = lazy(() => import("./main/scan"));

// Route wrappers
const PrivateRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  return userInfo ? children : <Navigate to="/login" />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  return userInfo ? <Navigate to="/home" /> : children;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/auth/profile", { withCredentials: true });
        if (response.status === 200 && response.data.id) {
          dispatch(setUserInfo(response.data));
        } else {
          dispatch(setUserInfo(undefined));
        }
      } catch {
        dispatch(setUserInfo(undefined));
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUser();
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
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <Circles height="50" width="50" color="#4fa94d" ariaLabel="loading" visible={true} />
        </div>
      }>
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
            <Route path="/event/:id" element={<PrivateRoute><Eventpage /></PrivateRoute>} />
            <Route path="/booking/:type/:id" element={<PrivateRoute><BookingDetials /></PrivateRoute>} />
            <Route path="/property/:id" element={<PrivateRoute><PropertyPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
            <Route path="*" element={<PrivateRoute><Login /></PrivateRoute>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
