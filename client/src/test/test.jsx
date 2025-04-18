import React, { useState } from "react";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ToastContainer, toast } from "react-toastify";
import { Select, SelectItem } from "@heroui/select";
import Feature from "../components/features";
import MapComponent from "../components/Map";
import ImageUploader from "@/components/imageupload";

const propertyTypes = [
  { key: "farms", label: "Farms" },
  { key: "beachfront", label: "Beachfront" },
  { key: "a-frames", label: "A-frames" },
  { key: "countryside", label: "Countryside" },
  { key: "amazing-pools", label: "Amazing pools" },
  { key: "treehouses", label: "Treehouses" },
  { key: "rooms", label: "Rooms" },
  { key: "castles", label: "Castles" },
  { key: "tiny-homes", label: "Tiny homes" },
  { key: "cabins", label: "Cabins" },
  { key: "boats", label: "Boats" },
  { key: "lakefront", label: "Lakefront" },
  { key: "shepherds-huts", label: "Shepherd's huts" },
  { key: "houseboats", label: "Houseboats" },
  { key: "mansions", label: "Mansions" },
  { key: "towers", label: "Towers" },
  { key: "trulli", label: "Trulli" },
  { key: "caves", label: "Caves" },
  { key: "camper-vans", label: "Camper vans" },
  { key: "earth-homes", label: "Earth homes" },
  { key: "hanoks", label: "Hanoks" },
  { key: "villa", label: "Villa" },
  { key: "studio", label: "Studio" },
  { key: "apartment", label: "Apartment" },
  { key: "house", label: "House" },
  { key: "other", label: "Other" },
];

<select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            >
              <option value="concert">Concert</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="meetup">Meetup</option>
              <option value="party">Party</option>
              <option value="festival">Festival</option>
              <option value="wedding">Wedding</option>
              <option value="webinar">Webinar</option>
              <option value="charity-event">Charity Event</option>
              <option value="other">Other</option>
            </select>
const Housing = () => {
  const [errors, setErrors] = useState({});
  const [formData, setformData] = useState({
    propertyType: "apartment",
    title: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handlePropertyTypeChange = (key) => {
    setformData({ ...formData, propertyType: key });
  };

  const handleDateTimeChange = (dateTime) => {
    setformData({ ...formData, houseDateTime: dateTime });
  };

  const validateFields = () => {
    const tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
    if (!formData.size) tempErrors.size = "Size is required";
    if (!formData.price) tempErrors.price = "Price is required";
    if (!formData.description) tempErrors.description = "Description is required";
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
          { data: formData, type: "property" },
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

  const handleCancel = () => {
    setformData({
      propertyType: "apartment",
      title: "",
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
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold mb-4">Property Details</h2>
        <form onSubmit={housingSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Property Type
            </label>
            <Select
              className="mt-2 w-full"
              items={propertyTypes}
              selectedKey={formData.propertyType}
              onSelectionChange={handlePropertyTypeChange}
              label="Select a property type"
              placeholder="Select a property type"
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>
          </div>

          <div className="mb-4">
            <label htmlFor="size" className="block text-sm font-semibold text-gray-700">
              Size
            </label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter size"
            />
            {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
              Price per Day
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter price per day"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              rows="3"
              placeholder="Enter description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Event Date and Time
            </label>
            <DateTimePicker
              sx={{ width: "100%", marginTop: "8px" }}
              value={formData.houseDateTime}
              onChange={handleDateTimeChange}
            />
          </div>

          {/* Add other fields here... */}
          <button
            type="submit"
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Submit Property
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Housing;
