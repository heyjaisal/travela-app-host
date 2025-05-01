import React, { useState } from "react";
import axiosInstance from '../utils/axios-instance';
import { ToastContainer, toast } from "react-toastify";
import Feature from "../components/features";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import MapComponent from "../components/Map";
import ImageUploader from "@/components/imageupload";
import { Input } from "@/components/ui/input";

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

const defaultFormData = {
  propertyType: "apartment",
  title: "",
  size: "",
  price: "",
  description: "",
  bedrooms: 0,
  kitchen: 0,
  bathrooms: 0,
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
}

const Housing = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState(defaultFormData);

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
    setformData(defaultFormData);
  };

  const handleImageUpload = async () => {
    try {
      const formDataImg = new FormData();
      formData.images.forEach((img) => {
        formDataImg.append("file", img.file);
      });
      formDataImg.append("type", "property");

      const res = await axiosInstance.post("/host/auth/upload", formDataImg, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return res.data.images.map((img) => img.imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Image upload failed");
    }
  };

  const validateFields = () => {
    const tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
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
      setLoading(true);
      try {

        const imageUrls = await handleImageUpload();

        const response = await axiosInstance.post(
          "/host/auth/add",
          {
            data: {
              ...formData,
              images: imageUrls,
            },
            type: "property",
          },
          {
            withCredentials: true,
          }
        );
        toast.success("Property details submitted successfully!");
        handleCancel();
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to submit property details.");
      }finally {
        setLoading(false);
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
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700"
            >
              Title
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 rounded-lg bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="property-type"
              className="block text-sm font-semibold text-gray-700"
            >
              Property Type
            </label>

            <Select
              value={formData.propertyType}
              onValueChange={(value) =>
                setformData({ ...formData, propertyType: value })
              }
            >
              <SelectTrigger className="mt-2 w-full bg-white p-5">
                <SelectValue placeholder="Select a property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Property Types</SelectLabel>
                  {propertyTypes.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="size"
              className="block text-sm font-semibold text-gray-700"
            >
              Size
            </label>
            <Input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              min="0"
              className="mt-2 block w-full p-6 rounded-lg border bg-white border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
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
            <Input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              className="mt-2 block w-full p-6 rounded-lg border bg-white border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
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
              className="mt-2 block w-full p-6 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
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
                  <Input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-16 text-center font-semibold text-xl px-3 py-1 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            )
          )}
        </form>
        <Feature formData={formData} setformData={setformData} />
      </div>
      {/* map section  */}
      <div>
        <ImageUploader
          formData={formData}
          setformData={setformData}
          type="housing"
        />
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
            disabled={loading}
          >
            {loading ? ( <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
              />
            </svg>) : "Submit"}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Housing;
