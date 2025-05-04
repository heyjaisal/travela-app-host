import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import { FaMap } from "react-icons/fa";
import axios from "axios"; // <-- import plain axios

const MapComponent = ({ formData, setformData }) => {
  const [searchQuery, setSearchQuery] = useState(formData.searchQuery);

  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng;
    setformData((prev) => ({ ...prev, location: { lat, lng } }));
    fetchAddress(lat, lng);
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const { address } = response.data;
      console.log(address);

      setformData((prev) => ({
        ...prev,
        address: `${address.city || address.town || address.village || "Unknown"}, ${address.road || "Unknown"}, ${address.state || "Unknown"}, ${address.country || "Unknown"}`,
        city: address.city || address.town || address.village || "Unknown",
        street: address.road || "Unknown",
        country: address.country || "Unknown",
        state: address.state || "Unknown",
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1`
      );
      const result = response.data[0];
      console.log(result);

      if (result) {
        const { lat, lon, display_name, address } = result;
        setformData({
          ...formData,
          location: { lat: parseFloat(lat), lng: parseFloat(lon) },
          address: display_name || "Unknown place",
          city: address?.city || address?.town || address?.village || "Unknown",
          street: address?.road || "Unknown",
          country: address?.country || "Unknown",
          state: address?.state || "Unknown",
        });
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const mapTypeToggle = () => {
    setformData((prev) => ({
      ...prev,
      mapType: prev.mapType === "satellite" ? "terrain" : "satellite",
    }));
  };

  const MapClick = () => {
    useMapEvent("click", handleMapClick);
    return null;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Pinpoint your location</h2>
      <div className="flex items-center mb-2">
        <input
          type="text"
          name="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a place"
          className="py-2 my-2 mr-3 px-3 rounded-lg text-center border border-gray-300 w-48"
        />
        <button
          onClick={handleSearch}
          className="py-2 px-4 bg-purple-600 text-white rounded-lg"
        >
          Search
        </button>
        <button
          onClick={mapTypeToggle}
          className="text-xl bg-white p-2 rounded-full shadow-md ml-3"
        >
          <FaMap />
        </button>
      </div>

      <div className="relative z-10">
        <MapContainer
          center={formData.location || { lat: 51.505, lng: -0.09 }}
          zoom={19}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
        >
          {formData.mapType === "satellite" ? (
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
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          )}
          <MapClick />
          <Marker position={formData.location || { lat: 51.505, lng: -0.09 }}>
            <Popup>{formData.address}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
