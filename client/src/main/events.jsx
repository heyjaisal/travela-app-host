import React, { useState } from "react";
import axios from "axios";
import Feature from "../components/features";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ToastContainer, toast } from "react-toastify";
import MapComponent from "../components/Map";
import ImageUploader from "@/components/imageupload";

const Events = () => {
  const [errors, setErrors] = useState({});

  const [formData, setformData] = useState({
    eventType: "concert",
    title: "",
    eventVenue: "",
    ticketPrice: 0,
    maxGuests: 0,
    description: "",
    eventDateTime: null,
    location: { lat: 51.505, lng: -0.09 },
    address: "",
    isFreeTicket: false,
    searchQuery: "",
    mapType: "satellite",
    features: [],
    featurestext: "",
    editfeatures: null,
    image: null,    
    public_id: "", 
    imageFile: null,
  });
  

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
    else if (formData.eventDateTime < new Date()) {
      tempErrors.eventDateTime = "Event date and time must be in the future";
    }
    if (formData.features.length === 0) {
      tempErrors.features = "At least one feature is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateFields()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/add",
          {
            data: formData, type:'event'
          },
          {
            withCredentials: true,
          }
        );

        console.log("Success:", response.data);
        toast.success("Event details submitted successfully!");
        setformData({
          eventType: "concert",
          title: "",
          eventVenue: "",
          ticketPrice: 0,
          maxGuests: 0,
          description: "",
          eventDateTime: null,
          location: { lat: 51.505, lng: -0.09 },
          address: "",
          isFreeTicket: false,
          mapType: "satellite",
          features: [],
          featurestext: "",
          editfeatures: null,
          image: "",
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to submit event details.");
      }
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold mb-4">Event Creation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Event Type
            </label>
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
                  formData.isFreeTicket
                    ? "Free Ticket"
                    : "Enter the ticket price"
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
              value={formData.eventDateTime}
              onChange={handleDateTimeChange}
              textFeild={(params) => (
                <input
                  {...params}
                  className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-700 focus:outline-none text-pink-900"
                />
              )}
            />
            {errors.eventDateTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.eventDateTime}
              </p>
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
                className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition duration-200"
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
                className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition duration-200"
              >
                <span className="text-2xl font-bold">+</span>
              </button>
            </div>
          </div>
        </form>

        {/* Add features */}
        <Feature formData={formData} setformData={setformData} />
      </div>
      {/* map section  */}
      <div>
    
   <ImageUploader formData={formData} setformData={setformData} type='event' />
    

        {formData.image && (
          <div className="mt-4">
            <img
              src={formData.image}
              alt="Uploaded"
              className="max-w-full h-auto rounded-md border border-gray-300"
            />
          </div>
        )}

        <MapComponent formData={formData} setformData={setformData} />

        <div className="mt-4">
          <p>Address: {formData.address}</p>
          <p>Latitude: {formData.location.lat}</p>
          <p>Longitude: {formData.location.lng}</p>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={() => {
              setformData({
                eventType: "concert",
                title: "",
                eventVenue: "",
                ticketPrice: 0,
                maxGuests: 0,
                description: "",
                eventDateTime: null,
                location: { lat: 51.505, lng: -0.09 },
                address: "",
                isFreeTicket: true,
                searchQuery: "",
                mapType: "satellite",
              });
            }}
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

      <ToastContainer />
    </div>
  );
};

export default Events;
