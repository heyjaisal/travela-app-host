import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import { FaMap } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
// Import styles

const Housing = () => {
  const [errors, setErrors] = useState({});
  const [houseData, sethouseData] = useState({
    propertyType: "apartment",
    size: "",
    price: "",
    description: "",
    bedrooms: 0,
    kitchen: 0,
    bathrooms: 0,
    maxGuests: 0,
    maxStay: 0,
    location: { lat: 51.505, lng: -0.09 },
    address: "",
    searchQuery: "",
    mapType: "satellite",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    sethouseData({ ...houseData, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${houseData.searchQuery}`
      );
      const result = response.data[0];
      if (result) {
        const { lat, lon, display_name } = result;
        setEventForm({
          ...houseData,
          location: { lat: parseFloat(lat), lng: parseFloat(lon) },
          address: display_name,
        });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const fetchAddress = async (lat,lng)=>{
    try{
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const {display_name}= response.data;
      sethouseData(
        (prev)=>({...prev,address :display_name}))
    }catch
    (
      error
    ){console.error("Error fetching address:", error)}
  }
  
  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng;
    sethouseData((prev) => ({ ...prev, location: { lat, lng } }));
    fetchAddress(lat, lng);
  };

  const increment = (field) => {
    sethouseData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decrement = (field) => {
    sethouseData((prev) => ({
      ...prev,
      [field]: Math.max(prev[field] - 1, 1),
    }));
  };
  const maptype = () => {
    sethouseData((prev) => ({
      ...prev,
      mapType: prev.mapType === "satellite" ? "terrain" : "satellite",
    }));
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!houseData.size) tempErrors.size = "Size is required";
    if (!houseData.price) tempErrors.price = "Price is required";
    if (!houseData.description) tempErrors.description = "Description is required";
    if (!houseData.location.lat || !houseData.location.lng) tempErrors.location = "Location is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const housingSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
        const response = await axios.post("http://localhost:5000/api/properties", houseData);
        console.log("Success:", response.data);
        toast.success("Property details submitted successfully!");
        sethouseData({
          propertyType: "apartment",
    size: "",
    price: "",
    description: "",
    bedrooms: 0,
    kitchen: 0,
    bathrooms: 0,
    maxGuests: 0,
    maxStay: 0,
    location: { lat: 51.505, lng: -0.09 },
    address: "",
    searchQuery: "",
    mapType: "satellite",

        }) // Success toast
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to submit property details."); // Error toast
      }
    }
  };

  const MapClick = () => {
      useMapEvent("click", handleMapClick);
      return null;
    };
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Property Details</h2>
        <form onSubmit={housingSubmit}>
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
              value={houseData.propertyType}
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
              value={houseData.size}
              onChange={handleInputChange}
              min="0"
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter size"
            />
            {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
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
              value={houseData.price}
              onChange={handleInputChange}
              min="0"
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter price per day"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
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
              value={houseData.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                  value={houseData[field]}
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
      <h2 className="text-lg font-semibold mb-4">Pin point your location</h2>

        <div className="flex items-center mb-2">
          <input
            type="text"
            value={houseData.searchQuery}
            onChange={handleInputChange}
            placeholder="Search for a place"
            className="py-2 my-2 mr-3 px-3 rounded-lg text-center border border-gray-300 w-48"
          />
          <button
            onClick={handleSearch}
            className="py-2 px-4 bg-purple-600 text-white rounded-lg "
          >
            Search
          </button>
          <div>
            <button
              onClick={maptype}
              className="text-xl bg-white p-2 rounded-full shadow-md ml-3"
            >
              <FaMap />
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="relative z-10">
          <MapContainer
                    center={houseData.location || { lat: 51.505, lng: -0.09 }} 
                    style={{ height: "400px", width: "100%" }}
                    onClick={handleMapClick}
                  >
                    {houseData.mapType === "satellite" ? (
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                      />
                    ) : (
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                    )}
                    <MapClick />
                    <Marker position={houseData.location || { lat: 51.505, lng: -0.09 }}>
                      <Popup>{houseData.address || "Default Address"}</Popup>
                    </Marker>
                  </MapContainer>
        </div>

        <div className="mt-4">
          <p>Location: {houseData.address}</p>
          <p>Latitude: {houseData.location.lat}</p>
          <p>Longitude: {houseData.location.lng}</p>
        </div>

        {/* Cancel and Submit Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={() =>
              sethouseData({
                propertyType: "apartment",
          size: "",
          price: "",
          description: "",
          bedrooms: 0,
          kitchen: 0,
          bathrooms: 0,
          maxGuests: 0,
          maxStay: 0,
          location: { lat: 51.505, lng: -0.09 },
          address: "",
          searchQuery: "",
          mapType: "satellite",
      
              })
            }
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={housingSubmit}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none flex-1"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Housing;
