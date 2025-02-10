import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, FileText, MessageCircle, Tag, Plus, Menu, X, User, Building, MessagesSquare } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { FaBell, FaCog, FaDollarSign, FaEnvelope, FaHome, FaMapMarkerAlt, FaPlus, FaRegCalendarAlt } from "react-icons/fa";
import { API_BASE_URL } from "@/utils/constants";

export default function Navigation() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileNavbar /> : <DesktopSidebar />;
}

function MobileNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);

  const handleNavLinkClick = () => {
    setIsSidebarOpen(false);
    setIsBottomNavVisible(false);
  };

  return (
    <>
      {/* Slide-In Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-50`}
      >
        <button className="p-4 text-black hover:text-blue-500" onClick={() => setIsSidebarOpen(false)}>
          <X className="w-6 h-6" />
        </button>
        <nav className="flex flex-col space-y-6 px-6 pb-6 pt-3">
        <NavLink
            to="/home"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
           
          >
            <Home className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Home</span>
          </NavLink>
          <NavLink
            to="/hosted"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Building className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Hosted</span>
          </NavLink>
          <NavLink
            to="/create"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Plus className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Host</span>
          </NavLink>
          <NavLink
            to="/messages"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <MessagesSquare className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Messages</span>
          </NavLink>
          <NavLink
            to="/payments"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Tag className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Payments</span>
          </NavLink>
          <NavLink
            to="/notifications"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <MessageCircle className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Notifications</span>
          </NavLink>
          <NavLink
            to="/booking"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <FileText className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Booking</span>
          </NavLink>
          <NavLink
            to="/profile"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <User className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Profile</span>
          </NavLink>
        </nav>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Bottom Navigation */}
      {isBottomNavVisible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-white px-4 rounded-2xl shadow-lg flex justify-between items-center">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-black" />
          </button>
          <NavLink
            to="/hosted"
            className="flex items-center justify-center p-3 rounded-full hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <FileText className="w-6 h-6 text-black" />
          </NavLink>
          <NavLink
            to="/create"
            className="absolute bottom-7 left-1/2 transform -translate-x-1/2 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Plus className="w-6 h-6 text-white" />
          </NavLink>
          <NavLink
            to="/messages"
            className="flex items-center justify-center p-3 rounded-full hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <MessageCircle className="w-6 h-6 text-black" />
          </NavLink>
          <NavLink
            to="/payments"
            className="flex items-center justify-center p-3 rounded-full hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Tag className="w-6 h-6 text-black" />
          </NavLink>
        </div>
      )}
    </>
  );
}
function DesktopSidebar() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [image, setImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (userInfo?.image) {
      setImage(`${API_BASE_URL}/${userInfo.image}`);
    }
  }, [userInfo?.image]);

  const firstNameInitial = userInfo?.firstName?.charAt(0) || userInfo?.email?.charAt(0) || "";

  return (
    <div
      className={`hidden md:flex flex-col ${isHovered ? "w-64" : "w-18"} text-slate-800 h-full transition-all duration-300 top-0 sticky z-10`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink to="/account">
        <div className="flex items-center gap-4 p-3 pt-6 pb-6 pl-4 border-b">
          <Avatar className="w-10 h-10 rounded-full overflow-hidden">
            {image ? <AvatarImage src={image} alt="Profile" className="object-cover w-full h-full" /> :
              <div className="uppercase h-full w-full text-3xl flex items-center justify-center border">
                {firstNameInitial}
              </div>
            }
          </Avatar>
          {isHovered && <h1 className="text-xl font-bold">Hello</h1>}
        </div>
      </NavLink>

      <nav className="flex-1 m-3 space-y-4">
        <NavItem to="/home" icon={FaHome} label="Home" isHovered={isHovered} />
        <NavItem to="/hosted" icon={FaMapMarkerAlt} label="Hosted" isHovered={isHovered} />
        <NavItem to="/payments" icon={FaDollarSign} label="Payment" isHovered={isHovered} />
        <NavItem to="/create" icon={FaRegCalendarAlt} label="Create" isHovered={isHovered} />
        <NavItem to="/notifications" icon={FaBell} label="Notification" isHovered={isHovered} />
        <NavItem to="/messages" icon={FaEnvelope} label="Messages" isHovered={isHovered} />
        <NavItem to="/booking" icon={FaPlus} label="Booking" isHovered={isHovered} />
        <NavItem to="/profile" icon={FaCog} label="Profile" isHovered={isHovered} />
      </nav>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, isHovered }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex items-center gap-4 p-3 rounded-xl ${isActive ? "bg-blue-600 text-white" : ""}`}>
      <Icon className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />
      {isHovered && <span>{label}</span>}
    </NavLink>
  );
}
