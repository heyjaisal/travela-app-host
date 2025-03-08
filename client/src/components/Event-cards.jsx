import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaEllipsisV } from "react-icons/fa";
import axios from "axios";

const EventCard = ({ images, eventType, ticketPrice, country, city, _id, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/host/delete/${_id}`, { withCredentials: true });
      onDelete(_id);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg">
      <Slider {...settings} className="rounded-xl overflow-hidden">
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Event ${index + 1}`}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        ))}
      </Slider>
      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">{eventType}</h3>
        <p className="text-gray-500 text-sm truncate">{city}, {country}</p>
        <div className="flex justify-between items-center mt-1 relative">
          <span className="text-lg font-bold">
            ₹{ticketPrice}/<span className="text-red-200 font-thin">ticket</span>
          </span>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-lg border rounded-md w-24 py-2">
              <button className="block w-full px-3 py-1 hover:bg-gray-200" onClick={() => alert("View Clicked")}>View</button>
              <button className="block w-full px-3 py-1 hover:bg-gray-200 text-red-500" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
