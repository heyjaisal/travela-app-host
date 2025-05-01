import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axios-instance";
import { MoreHorizontal } from "lucide-react";
import { FaEllipsisV } from "react-icons/fa";

const EventCard = ({
  images,
  eventVenue,
  ticketPrice,
  country,
  city,
  _id,
  isSaved,
  averageRating,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${_id}`);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/host/delete/${_id}`, {
        withCredentials: true,
      });
      onDelete(_id);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div
      className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer"
      onClick={handleClick}
    >
       <div className="overflow-hidden">
        {images.length > 1 ? (
          <Slider {...settings} className="rounded-xl">
            {images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Property ${index + 1}`}
                  className="w-full h-72 object-cover rounded-xl"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={images[0]}
            alt="Property"
            className="w-full h-72 object-cover rounded-xl"
          />
        )}
      </div>

      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">{eventVenue}</h3>
        <p className="text-gray-500 text-sm truncate">
          {city}, {country}
        </p>
        <span className="text-lg font-bold">
          ₹{ticketPrice}/<span className="text-red-200 font-thin">ticket</span>
        </span>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          <FaEllipsisV />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-10 bg-white shadow-lg border rounded-md w-24 py-2">
            <button
              className="block w-full px-3 py-1 hover:bg-gray-200 text-red-500"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;


