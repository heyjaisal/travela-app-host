import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaDollarSign,
  FaRegCalendarAlt,
  FaBell,
  FaEnvelope,
  FaCog ,
  FaPlus,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const UserNavbar = () => {
  const [user, setUser] = useState({ name: "", profileImage: "" });
  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          withCredentials: true,
        });
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col ${
          isHovered ? "w-64" : "w-18 bg-red-600"
        } text-slate-800 h-full transition-all duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NavLink
        
        to="/account">
        <div className="flex items-center gap-4 p-3 pt-6 pb-6 pl-4 border-b">
          <img
            src={user.profileImage || "/client/public/no-profile.jpg"}
            alt="User"
            className="w-9 h-9 rounded-full object-cover"
          />
          {isHovered && <h1 className="text-xl font-bold">{user.name}</h1>}
        </div>
        </NavLink>

        <nav className="flex-1 m-3 space-y-4">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaHome className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />
            {isHovered && <span>Home</span>}
          </NavLink>
          <NavLink
            to="/hosted"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaMapMarkerAlt
              className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`}
            />
            {isHovered && <span>Hosted</span>}
          </NavLink>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaDollarSign className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />

            {isHovered && <span>Payment</span>}
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaRegCalendarAlt
              className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`}
            />
            {isHovered && <span>Create</span>}
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaBell className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />
            {isHovered && <span>Notification</span>}
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaEnvelope className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />
            {isHovered && <span>Messages</span>}
          </NavLink>
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaPlus className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />
            {isHovered && <span>Booking</span>}
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaCog  className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />
            {isHovered && <span>Profile</span>}
          </NavLink>
        </nav>
      </div>
      {/* Mobile Navbar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white shadow-lg border-t z-50">
        <nav className="flex justify-around p-2 text-slate-800">
          <button
            onClick={toggleSidebar}
            className="flex flex-col items-center gap-1"
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            <span className="text-xs">Menu</span>
          </button>

          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${
                isActive ? "text-blue-500" : ""
              }`
            }
          >
            <FaEnvelope size={20} />
            <span className="text-xs">Messages</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${
                isActive ? "text-blue-500" : ""
              }`
            }
          >
            {/* User Profile Image */}
            <div className="flex flex-col items-center gap-1">
              <img
                src={user.profileImage || "/client/public/no-profile.jpg"}
                alt="User"
                className="w-8 h-8 rounded-full border border-slate-300"
              />
              <span className="text-xs">Me</span>
            </div>
          </NavLink>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>
          <div className="fixed inset-y-0 left-0 bg-white w-64 z-50 shadow-lg flex flex-col">
            <div className="flex items-center justify-center h-20 border-b">
              <h1 className="text-2xl font-bold">Host Dashboard</h1>
            </div>
            <nav className="flex-1 p-4 space-y-4">
              <NavLink
                to="/home"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaHome />
                Home
              </NavLink>
              <NavLink
                to="/hosted"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaMapMarkerAlt />
                Hosted
              </NavLink>
              <NavLink
                to="/payments"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaEnvelope />
                Payments
              </NavLink>
              <NavLink
                to="/create"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaRegCalendarAlt />
                Create
              </NavLink>
              <NavLink
                to="/notifications"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaBell />
                Notification
              </NavLink>
              <NavLink
                to="/messages"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaEnvelope />
                Messages
              </NavLink>
              <NavLink
                to="/booking"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaPlus />
                Booking
              </NavLink>
              <NavLink
                to="/profile"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaCog  />
                Profile
              </NavLink>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default UserNavbar;
