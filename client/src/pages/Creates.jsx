import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [activeTab, setActiveTab] = useState("housing");

  // State to hold form data
  const [formData, setFormData] = useState({
    propertyType: "apartment",
    size: "",
    price: "",
    description: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle dropdown change
  const handleDropdownChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      propertyType: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header and Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl pl-3.5 pt-2 font-bold font-sans">Host</h1>
        <input
          type="text"
          placeholder="Search"
          className="py-2 my-2 mr-3 px-3 rounded-lg text-center border border-gray-300 w-48"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("housing")}
          className={`py-2 px-4 text-lg font-poppins border-b-4 ${
            activeTab === "housing"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600"
          }`}
        >
          Housing
        </button>
        <button
          onClick={() => setActiveTab("event")}
          className={`py-2 px-4 text-lg font-poppins border-b-4 ${
            activeTab === "event"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600"
          }`}
        >
          Event
        </button>
      </div>

      {/* Content based on active tab */}
      <div>
        {activeTab === "housing" && (
          <div className="flex flex-col lg:flex-row gap-8 mb-4">
            {/* Form Inputs Section */}
            <div className="flex-1 p-4">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>

              {/* Property Type Dropdown */}
              <div className="mb-4">
                <label
                  htmlFor="property-type"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Property Type
                </label>
                <select
                  id="property-type"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleDropdownChange}
                  className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="villa">Villa</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Size Input */}
              <div className="mb-4">
                <label
                  htmlFor="size"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Size
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="Enter size"
                />
              </div>

              {/* Price per Day Input */}
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Price per Day
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="Enter price per day"
                />
              </div>

              {/* Description Textarea */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="Enter description"
                />
              </div>
            </div>

            {/* Content for Event (on the right side) */}
            <div className="flex-1 p-4">
              <h1 className="text-lg font-semibold">Event Content</h1>
              <p className="text-sm text-gray-700">
                Add content for housing here.
              </p>
            </div>
          </div>
        )}

        {activeTab === "event" && (
          <div className="flex flex-col lg:flex-row gap-8 mb-4">
            <div className="flex-1 p-4">
              <h1>Event Content 1</h1>
            </div>

            <div className="flex-1 p-4">
              <h1>Event Content 2</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
