import React, { useState } from "react";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ToastContainer, toast } from "react-toastify";
import Feature from "../components/features";
import MapComponent from "../components/Map";
import ImageUploader from "@/components/imageupload";

const Housing = () => {
  const [errors, setErrors] = useState({});
  const [formData, setformData] = useState({
    propertyType: "apartment",
    size: "",
    price: "",
    description: "",
    bedrooms: 0,
    kitchen: 0,
    bathrooms: 0,
    houseDateTime: null,
    maxGuests: 0,
    maxStay: 0,
    location: { lat: 11.25390467304297, lng: 75.7804084176639 },
    address: "",
    city: "",
    state: "",
    country: "",
    street: "",
    searchQuery: "",
    mapType: "satellite",
    features: [],
    featurestext: "",
    editfeatures: null,
    images: [],
  });


  const handleDateTimeChange = (dateTime) => {
    setformData({ ...formData, houseDateTime: dateTime });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const increment = (field) => {
    setformData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decrement = (field) => {
    setformData((prev) => ({
      ...prev,
      [field]: Math.max(prev[field] - 1, 1),
    }));
  };

  const handleCancel = () => {
    setformData({
      propertyType: "apartment",
      size: "",
      price: "",
      description: "",
      bedrooms: 0,
      kitchen: 0,
      bathrooms: 0,
      houseDateTime: null,
      maxGuests: 0,
      maxStay: 0,
      location: { lat: 11.25390467304297, lng: 75.7804084176639 },
      address: "",
      searchQuery: "",
      mapType: "satellite",
      features: [],
      featurestext: "",
      editfeatures: null,
      images: [], 
    });
  };

  const validateFields = () => {
    const tempErrors = {};
    if (!formData.size) tempErrors.size = "Size is required";
    if (!formData.price) tempErrors.price = "Price is required";
    if (!formData.description)
      tempErrors.description = "Description is required";
    if (!formData.location.lat || !formData.location.lng)
      tempErrors.location = "Location is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const housingSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/host/auth/add",
          { data: formData, type: 'property' },
          { withCredentials: true }
        );
        toast.success("Property details submitted successfully!");
        handleCancel();
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to submit property details.");
      }
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold mb-4">Property Details</h2>
        <form onSubmit={housingSubmit}>
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
            {errors.size && (
              <p className="text-red-500 text-sm mt-1">{errors.size}</p>
            )}
          </div>

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
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

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
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Event Date and Time
            </label>
            <DateTimePicker
              sx={{ width: "100%" }}
              value={formData.houseDateTime}
              onChange={handleDateTimeChange}
              textFeild={(params) => (
                <input
                  {...params}
                  className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-700 focus:outline-none text-pink-900"
                />
              )}
            />
            {errors.houseDateTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.houseDateTime}
              </p>
            )}
          </div>

          {["bedrooms", "kitchen", "bathrooms", "maxGuests", "maxStay"].map(
            (field) => (
              <div
                key={field}
                className="border rounded-lg p-2 flex items-center justify-between bg-white mb-4"
              >
                <label className="text-lg font-semibold text-gray-800 mr-4 pl-1">
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")}
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
                    < span className="text-2xl font-bold">+</span>
                  </button>
                </div>
              </div>
            )
          )}
        </form>
        <Feature formData={formData} setformData={setformData} />
      </div>
      {/* map section  */}
      <div>
        <ImageUploader formData={formData} setformData={setformData} type='housing' />
        <MapComponent formData={formData} setformData={setformData} />

        <div className="mt-4">
          <p>Location: {formData.address}</p>
          <p>Latitude: {formData.location.lat}</p>
          <p>Longitude: {formData.location.lng}</p>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={handleCancel}
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

      <ToastContainer />
    </div>
  );
};

export default Housing;