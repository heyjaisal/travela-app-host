import React, { useState } from "react";
import Events from "../main/events";
import Housing from "../main/housing";

const HostPage = () => {
  const [activeTab, setActiveTab] = useState("housing");

  return (
    <div className="container mx-auto p-4 pb-16">
      <h1 className="text-xl pl-3.5 pt-2 font-bold">Host</h1>

      <div className="flex mb-4 border-b-2 border-gray-300">
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

      {activeTab === "housing" ? <Housing /> : <Events />}
    </div>
  );
};

export default HostPage;
