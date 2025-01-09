import React, { useState } from 'react';
import Profile from "../main/profile";
import Settings from "../main/settings";

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto pl-1 p-4 pb-16">
      <h1 className="text-xl pl-3.5 pt-2 font-bold">Account</h1>

      <div className="flex mb-4 border-b-2 border-gray-300">
        <button
          onClick={() => setActiveTab("profile")}
          className={`py-2 px-4 text-lg ${activeTab === "profile" ? "border-b-4 border-purple-600 text-purple-600" : "text-gray-600"}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-2 px-4 text-lg ${activeTab === "settings" ? "border-b-4 border-purple-600 text-purple-600" : "text-gray-600"}`}
        >
          Settings
        </button>
      </div>

      {activeTab === "profile" ? <Profile /> : <Settings />}
    </div>
  );
};

export default Account;
