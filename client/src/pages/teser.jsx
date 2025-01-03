import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import { FaMap } from "react-icons/fa";

const HostPage = () => {
  const [activeTab, setActiveTab] = useState("housing");
  const [formData, setFormData] = useState({
    propertyType: "apartment",
    size: "",
    price: "",
    description: "",
    bedrooms: 0,
    kitchen: 0,
    bathrooms: 0,
    maxGuests: 0,
    maxStay: 0,
  });

  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 }); // Default location
  const [address, setAddress] = useState(""); // For storing address
  const [searchQuery, setSearchQuery] = useState(""); // For search bar input
  const [mapType, setMapType] = useState("satellite");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const result = response.data[0];
      if (result) {
        const { lat, lon, display_name } = result;
        setLocation({ lat, lng: lon });
        setAddress(display_name);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const { display_name } = response.data;
      setAddress(display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng;
    setLocation({ lat, lng });
    fetchAddress(lat, lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include the location data (latitude, longitude, and address) in the form submission
      const submissionData = { ...formData, location, address };
      const response = await axios.post("http://localhost:5000/api/properties", submissionData);
      console.log("Success:", response.data);
      alert("Property details submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit property details.");
    }
  };

  const increment = (field) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decrement = (field) => {
    setFormData((prev) => ({ ...prev, [field]: Math.max(prev[field] - 1, 1) }));
  };

  const MapClick = () => {
    useMapEvent("click", (e) => {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      fetchAddress(e.latlng.lat, e.latlng.lng);
    });
  };

  return (
    <div className="container mx-auto p-4 pb-16">
      {/* Header and Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl pl-3.5 pt-2 font-bold font-sans">Host</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <form onSubmit={handleSubmit}>
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
                    onChange={handleInputChange}
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
                    type="number"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    min="0"
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
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
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

                {/* Increment/Decrement Sections */}
                {["bedrooms", "kitchen", "bathrooms", "maxGuests", "maxStay"].map((field) => (
                  <div key={field} className="border rounded-lg p-2 flex items-center justify-between bg-white mb-4">
                    <label className="text-lg font-semibold text-gray-800 mr-4 pl-1">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => decrement(field)}
                        className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition duration-200"
                      >
                        <span className="text-2xl font-bold">-</span>
                      </button>
                      <input
                        type="number"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className="w-16 text-center font-semibold text-xl px-3 py-1 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => increment(field)}
                        className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition duration-200"
                      >
                        <span className="text-2xl font-bold">+</span>
                      </button>
                    </div>
                  </div>
                ))}
              </form>
            </div>

            {/* Right Section: Map and Buttons */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a place"
                  className="py-2 my-2 mr-3 px-3 rounded-lg text-center border border-gray-300"
                />
                <button
                  onClick={handleSearch}
                  className="py-2 px-4 bg-purple-600 text-white rounded-lg"
                >
                  Search
                </button>
                <div>
                  <button
                    onClick={() =>
                      setMapType((prevType) =>
                        prevType === "satellite" ? "terrain" : "satellite"
                      )
                    }
                    className="text-xl bg-white p-2 rounded-full shadow-md ml-3"
                  >
                    <FaMap />
                  </button>
                </div>
              </div>

              {/* Map */}
              <div className="relative z-10">
                <MapContainer
                  center={location}
                  zoom={19}
                  scrollWheelZoom={true}
                  style={{ height: "400px", width: "100%" }}
                  onClick={handleMapClick}
                >
                  {mapType === "satellite" && (
                    <>
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
                      />
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                        attribution='Labels &copy; <a href="https://www.esri.com/">Esri</a>'
                      />
                    </>
                  )}

                  {mapType === "terrain" && (
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                  )}

                  <MapClick />
                  <Marker position={location}>
                    <Popup>{address}</Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="mt-4">
                <p>Location: {address}</p>
                <p>Latitude: {location.lat}</p>
                <p>Longitude: {location.lng}</p>
              </div>

              {/* Cancel and Submit Buttons */}
              <div className="flex space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      propertyType: "apartment",
                      size: "",
                      price: "",
                      description: "",
                      bedrooms: 0,
                      kitchen: 0,
                      bathrooms: 0,
                      maxGuests: 0,
                      maxStay: 0,
                    })
                  }
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none flex-1"
                >
                  Submit
                </button>
              </div>
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
};

export default HostPage;
