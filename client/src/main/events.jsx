import React, { useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import { FaMap,FaTrash ,FaEdit } from "react-icons/fa";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ToastContainer, toast } from "react-toastify";

const Events = () => {
  const [errors, setErrors] = useState({});
  const [features, setfeatures] = useState([]);
  const [featurestext, setfeaturestext] = useState("");
  const [editfeatures, setEditfeatures] = useState(null);

  const [eventForm, setEventForm] = useState({
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
  });

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const handleDateTimeChange = (dateTime) => {
    setEventForm({ ...eventForm, eventDateTime: dateTime });
  };

  const handleFreeTicket = () => {
    setEventForm((prev) => ({
      ...prev,
      isFreeTicket: true,
      ticketPrice: 0,
    }));
  };
  const maptype = () => {
    setEventForm((prev) => ({
      ...prev,
      mapType: prev.mapType === "satellite" ? "terrain" : "satellite",
    }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${eventForm.searchQuery}`
      );
      const result = response.data[0];
      if (result) {
        const { lat, lon, display_name } = result;
        setEventForm({
          ...eventForm,
          location: { lat: parseFloat(lat), lng: parseFloat(lon) },
          address: display_name,
        });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleAddTodo = () => {
    if (featurestext.trim() === "") return;

    if (editfeatures) {
      setfeatures(
        features.map((todo) =>
          todo.id === editfeatures ? { ...todo, text: featurestext } : todo
        )
      );
      setEditfeatures(null);
    } else {
      const newTodo = {
        id: Date.now(),
        text: featurestext.trim(),
      };
      setfeatures([...features, newTodo]);
    }
    setfeaturestext(""); 
  };

  const handleEditTodo = (id) => {
    const todoToEdit = features.find((todo) => todo.id === id);
    setfeaturestext(todoToEdit.text); 
    setEditfeatures(id); 
  };

  const handleDeleteTodo = (id) => {
    setfeatures(features.filter((todo) => todo.id !== id));
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const { display_name } = response.data;
      setEventForm((prev) => ({ ...prev, address: display_name }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng;
    setEventForm((prev) => ({ ...prev, location: { lat, lng } }));
    fetchAddress(lat, lng);
  };

  const increment = (field) => {
    setEventForm((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decrement = (field) => {
    setEventForm((prev) => ({
      ...prev,
      [field]: Math.max(prev[field] - 1, 1),
    }));
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!eventForm.title) tempErrors.title = "Title is required";
    if (!eventForm.eventVenue) tempErrors.eventVenue = "Event venue is required";
    if (
      !eventForm.isFreeTicket &&
      (!eventForm.ticketPrice || eventForm.ticketPrice <= 0) &&
      eventForm.ticketPrice !== 0
    )
      tempErrors.ticketPrice =
        "Ticket price must be greater than zero or 'Free'";
    if (!eventForm.description) tempErrors.description = "Description is required";
    if (!eventForm.location.lat || !eventForm.location.lng)
      tempErrors.location = "Location is required";
    if (!eventForm.eventDateTime)
      tempErrors.eventDateTime = "Event date and time are required";
    else if (eventForm.eventDateTime < new Date()) {
      tempErrors.eventDateTime = "Event date and time must be in the future";
    }
    if (features.length === 0) {
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
                "http://localhost:5000/api/events", 
                {
                    event: eventForm,
                    features: features,
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Success:", response.data);
            toast.success("Event details submitted successfully!");
            setEventForm({
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
                mapType:'satellite'
            });
            setfeatures([]);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to submit event details.");
        }
    }
};

  
  const MapClick = () => {
    useMapEvent("click", handleMapClick);
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">Event Creation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Event Type
            </label>
            <select
              name="eventType"
              value={eventForm.eventType}
              onChange={handleEventChange}
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
              value={eventForm.title}
              onChange={handleEventChange}
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
              value={eventForm.eventVenue}
              onChange={handleEventChange}
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
                value={eventForm.isFreeTicket ? 0 : eventForm.ticketPrice}
                onChange={handleEventChange}
                disabled={eventForm.isFreeTicket}
                placeholder={
                  eventForm.isFreeTicket
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
              value={eventForm.description}
              onChange={handleEventChange}
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
              value={eventForm.eventDateTime}
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
                value={eventForm.maxGuests}
                onChange={handleEventChange}
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
        <div className="mb-4">
          <label className="block text-sm font-poppins font-bold text-gray-700">
            Add new features
          </label>
          <div className="flex">
            <input
              type="text"
              value={featurestext}
              onChange={(e) => setfeaturestext(e.target.value)}
              placeholder={editfeatures ? "Edit feature" : "Enter a new feature"}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTodo}
              className="ml-4 mt-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {editfeatures ? "Save" : "Add"}
            </button>
          </div>
        </div>
        <ul>
          {features.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center mt-2 p-3 bg-gray-100 rounded-lg shadow-sm"
            >
              <span className="cursor-pointer text-gray-800">{todo.text}</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleEditTodo(todo.id)}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                  title="Edit"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  title="Delete"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Map Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Pin point your location</h2>

        <div className="flex items-center mb-4">
          <input
            type="text"
            name="searchQuery"
            value={eventForm.searchQuery}
            onChange={handleEventChange}
            placeholder="Search for a place"
            className="py-2 px-3 border border-gray-300 rounded-lg mr-2 w-48"
          />
          <button
            onClick={handleSearch}
            className="py-2 px-4 bg-purple-600 text-white rounded-lg"
          >
            Search
          </button>
          <button
            onClick={maptype}
            className="text-xl bg-white p-2 rounded-full shadow-md ml-3"
          >
            <FaMap />
          </button>
        </div>
        <div className="relative z-10">
          <MapContainer
            center={eventForm.location || { lat: 51.505, lng: -0.09 }}
            zoom={19}
            scrollWheelZoom={true}
            style={{ height: "400px", width: "100%" }}
            onClick={handleMapClick}
          >
            {eventForm.mapType === "satellite" && (
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
            {eventForm.mapType === "terrain" && (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
            )}
            <MapClick />
            <Marker
              position={eventForm.location || { lat: 51.505, lng: -0.09 }}
            >
              <Popup>{eventForm.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="mt-4">
          <p>Address: {eventForm.address}</p>
          <p>Latitude: {eventForm.location.lat}</p>
          <p>Longitude: {eventForm.location.lng}</p>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={() => {
              setEventForm({
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