import React, { useState } from "react";
import axiosInstance from "../utils/axios-instance";
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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ToastContainer, toast } from "react-toastify";
import MapComponent from "../components/Map";
import ImageUploader from "@/components/imageupload";
import dayjs from "dayjs";

const eventTypes = [
  { key: "concert", label: "Concert" },
  { key: "conference", label: "Conference" },
  { key: "workshop", label: "Workshop" },
  { key: "seminar", label: "Seminar" },
  { key: "meetup", label: "Meetup" },
  { key: "party", label: "Party" },
  { key: "festival", label: "Festival" },
  { key: "wedding", label: "Wedding" },
  { key: "webinar", label: "Webinar" },
  { key: "charity-event", label: "Charity Event" },
  { key: "other", label: "Other" },
];

const defaultFormData = {
  eventType: "concert",
  title: "",
  eventVenue: "",
  ticketPrice: 0,
  maxGuests: 0,
  description: "",
  eventDateTime: null,
  location: { lat: 11.25390467304297, lng: 75.7804084176639 },
  address: "",
  city: "",
  street: "",
  country: "",
  state: "",
  isFreeTicket: false,
  searchQuery: "",
  mapType: "satellite",
  features: [],
  featurestext: "",
  editfeatures: null,
  images: [],
};

const Events = () => {
  const [formData, setformData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDateTimeChange = (dateTime) => {
    setformData({ ...formData, eventDateTime: dateTime });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleFreeTicket = () => {
    setformData((prev) => ({
      ...prev,
      isFreeTicket: true,
      ticketPrice: 0,
    }));
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

  const validateFields = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
    if (!formData.eventVenue) tempErrors.eventVenue = "Event venue is required";
    if (
      !formData.isFreeTicket &&
      (!formData.ticketPrice || formData.ticketPrice <= 0) &&
      formData.ticketPrice !== 0
    )
      tempErrors.ticketPrice =
        "Ticket price must be greater than zero or 'Free'";
    if (!formData.description)
      tempErrors.description = "Description is required";
    if (!formData.location.lat || !formData.location.lng)
      tempErrors.location = "Location is required";
    if (!formData.eventDateTime)
      tempErrors.eventDateTime = "Event date and time are required";
    else if (dayjs(formData.eventDateTime).isBefore(dayjs())) {
      tempErrors.eventDateTime = "Event date and time must be in the future";
    }
    if (formData.features.length === 0) {
      tempErrors.features = "At least one feature is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleImageUpload = async () => {
    try {
      const formDataImg = new FormData();
      formData.images.forEach((img) => {
        formDataImg.append("file", img.file);
      });
      formDataImg.append("type", "event");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    setLoading(true);

    try {
      const imageUrls = await handleImageUpload();

      await axiosInstance.post(
        "/host/auth/add",
        {
          data: {
            ...formData,
            images: imageUrls,
          },
          type: "event",
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Event details submitted successfully!");
      setformData(defaultFormData);
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error("Failed to submit event details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold mb-4">Event Creation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Select
              value={formData.eventType}
              onValueChange={(value) =>
                setformData({ ...formData, eventType: value })
              }
            >
              <SelectTrigger className="mt-2 w-full bg-white p-5">
                <SelectValue placeholder="Select a event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Event Types</SelectLabel>
                  {eventTypes.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter Title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Event Venue
            </label>
            <input
              type="text"
              name="eventVenue"
              value={formData.eventVenue}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter Event Venue"
            />
            {errors.eventVenue && (
              <p className="text-red-500 text-sm mt-1">{errors.eventVenue}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Ticket Price
            </label>
            <div className="flex">
              <input
                type="number"
                name="ticketPrice"
                value={formData.isFreeTicket ? 0 : formData.ticketPrice}
                onChange={handleInputChange}
                disabled={formData.isFreeTicket}
                placeholder={
                  formData.isFreeTicket ? "Free Ticket" : "Enter the ticket price"
                }
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleFreeTicket}
                className="ml-4 mt-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Free
              </button>
            </div>
            {errors.ticketPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.ticketPrice}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
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
              value={formData.eventDateTime}
              onChange={handleDateTimeChange}
              sx={{ width: "100%", marginTop: "8px" }}
            />
            {errors.eventDateTime && (
              <p className="text-red-500 text-sm mt-1">{errors.eventDateTime}</p>
            )}
          </div>

          <div className="border rounded-lg p-2 flex items-center justify-between bg-white mb-4">
            <label className="text-lg font-semibold text-gray-800 mr-4 pl-1">
              Max Guests
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => decrement("maxGuests")}
                className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700"
              >
                <span className="text-2xl font-bold">-</span>
              </button>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleInputChange}
                className="w-16 text-center font-semibold text-xl px-3 py-1 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => increment("maxGuests")}
                className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700"
              >
                <span className="text-2xl font-bold">+</span>
              </button>
            </div>
          </div>

          <Feature formData={formData} setformData={setformData} />
        </form>
      </div>

      <div>
        <ImageUploader formData={formData} setformData={setformData} type="event" />
        <MapComponent formData={formData} setformData={setformData} />

        <div className="mt-4">
          <p>Address: {formData.address}</p>
          <p>Latitude: {formData.location.lat}</p>
          <p>Longitude: {formData.location.lng}</p>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={() => setformData(defaultFormData)}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none flex-1"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
                />
              </svg>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Events;
