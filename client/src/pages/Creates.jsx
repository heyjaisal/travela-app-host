import React, { useState } from "react";
import {
  useMapEvent,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import { FaMap, FaCloudUploadAlt } from "react-icons/fa"; // Importing an icon for the map
import axios from "axios";
import { useDropzone } from "react-dropzone"; // Import for drag-and-drop

function Profile() {
  const [activeTab, setActiveTab] = useState("housing");
  const [formData, setFormData] = useState({
    propertyType: "apartment",
    size: "",
    price: "",
    description: "",
  });

  // States for map functionality
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapType, setMapType] = useState("satellite"); // State to control map type
  const [files, setFiles] = useState([]); // State for uploaded files

  // To-Do List States
  const [todos, setTodos] = useState([]); // State to store tasks

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle map click to pin location
  const MapClick = () => {
    useMapEvent("click", (e) => {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      fetchAddress(e.latlng.lat, e.latlng.lng);
    });
  };

  // Handle search query for place search (using Nominatim API)
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

  // Reverse geocoding to get address from coordinates
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

  // Drag-and-Drop file handling
  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Add To-Do Task
  const addTodo = (task) => {
    axios
      .post("/api/todos", { task }) // Send a POST request to add a new task
      .then((response) => {
        setTodos([...todos, response.data]);
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Delete To-Do Task
  const deleteTodo = (id) => {
    axios
      .delete(`/api/todos/${id}`) // Send a DELETE request to remove the task
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Update To-Do Task
  const updateTodo = (id, updatedTask) => {
    axios
      .put(`/api/todos/${id}`, { task: updatedTask }) // Send a PUT request to update the task
      .then((response) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? response.data : todo
        );
        setTodos(updatedTodos);
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <div className="container mx-auto p-4">
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
          <div className="flex flex-col lg:flex-row mb-4">
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

              {/* To-Do List Section */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4 text-purple-600">To-Do List</h2>
                <ul className="space-y-2">
                  {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm">
                      <span>{todo.task}</span>
                      <div className="space-x-2">
                        <button
                          className="text-blue-500"
                          onClick={() => updateTodo(todo.id, prompt("Edit task", todo.task))}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
                  onClick={() => {
                    const task = prompt("New task:");
                    if (task) addTodo(task);
                  }}
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Map Section */}
            <div className="flex-1 p-3 pt-0">
              {/* File Upload */}
              <div className="mb-4">
                <h1 className="text-sm font-semibold mb-2">
                  Upload Room Photos
                </h1>
                <div
                  {...getRootProps({
                    className:
                      "border-dashed border-2 border-gray-300 rounded-lg p-4 p-12 text-center flex flex-col items-center justify-center",
                  })}
                >
                  <input {...getInputProps()} />
                  <p className="mb-2">Drag and drop files</p>
                  <FaCloudUploadAlt className="text-3xl mb-2" />
                  <p>Browse File</p>
                </div>
                {/* Display uploaded files */}
                <div className="mt-2">
                  {files.map((file, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {file.name}
                    </p>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a place"
                  className="py-2 my-2 mr-3 px-3 rounded-lg text-center border border-gray-300 w-40"
                />
                <button
                  onClick={handleSearch}
                  className="py-2 px-4 bg-purple-600 text-white rounded-lg w-30"
                >
                  Search
                </button>
                <div className=" m-4">
                  <button
                    onClick={() =>
                      setMapType((prevType) =>
                        prevType === "satellite" ? "terrain" : "satellite"
                      )
                    }
                    className="text-xl bg-white p-2 rounded-full shadow-md"
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
                >
                  {/* Conditionally Render TileLayer based on mapType */}
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
