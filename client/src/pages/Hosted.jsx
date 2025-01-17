import React,{useState} from 'react'
import EventUpdate from '../main/update.event';
import HouseUpdate from '../main/update.housing';

const hosted = () => {
  const [activeTab, setActiveTab] = useState("housing");

  return (
    <div className="pb-16 p-3 bg-lightBg">
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

      <div>
        {activeTab === "housing" ? <HouseUpdate /> : <EventUpdate />}
      </div>
    </div>
  )
}

export default hosted
