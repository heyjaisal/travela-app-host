import React, { useState } from "react";
import Events from "../main/events";
import Housing from "../main/housing";

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 text-lg font-poppins border-b-4 ${
      isActive ? "border-purple-600 text-purple-600" : "border-transparent text-gray-600"
    }`}
    aria-selected={isActive}
    role="tab"
  >
    {label}
  </button>
);

const HostPage = () => {
  const [activeTab, setActiveTab] = useState("housing");

  return (
    <div className="container mx-auto p-4 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl pl-3.5 pt-2 font-bold font-sans">Host</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4" role="tablist">
        <TabButton
          label="Housing"
          isActive={activeTab === "housing"}
          onClick={() => setActiveTab("housing")}
        />
        <TabButton
          label="Event"
          isActive={activeTab === "event"}
          onClick={() => setActiveTab("event")}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "housing" ? <Housing /> : <Events />}
    </div>
  );
};

export default HostPage;
