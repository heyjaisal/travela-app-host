import React, { useState } from "react";
import { X } from "lucide-react"; 
import Events from "../main/events";
import Housing from "../main/housing";
import { useNavigate } from "react-router-dom";

const HostPage = () => {
  const [activeTab, setActiveTab] = useState("housing");
  const navigate = useNavigate(); 

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="pb-5 p-3 bg-lightBg z-50">
      <h1 className="text-xl pl-3.5 pt-2 font-bold">Host</h1>

      {/* Sticky Navbar */}
      <div className="mb-4 border-b-2 border-gray-300 top-0 bg-lightBg">
        <button
          onClick={() => setActiveTab("housing")}
          className={`py-2 px-4 text-lg ${activeTab === "housing" ? "border-b-4 border-purple-600 text-purple-600" : "text-gray-600"}`}
        >
          Housing
        </button>
        <button
          onClick={() => setActiveTab("event")}
          className={`py-2 px-4 text-lg ${activeTab === "event" ? "border-b-4 border-purple-600 text-purple-600" : "text-gray-600"}`}
        >
          Event
        </button>
      </div>

      <button onClick={handleClose} className="absolute top-4 right-4 text-gray-700">
        <X className="w-6 h-6" />
      </button>

      <div>
        {activeTab === "housing" ? <Housing /> : <Events />}
      </div>
    </div>
  );
};

export default HostPage;
