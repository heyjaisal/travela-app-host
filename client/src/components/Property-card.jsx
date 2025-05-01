

import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";

const PropertyCard = ({ images, propertyType, price, country, city, _id,averageRating, isSaved }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${_id}`);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/listing/delete/${_id}`, {
        data: { type: 'property' },
        withCredentials: true
      });
      onDelete(_id);
    } catch (error) {
      console.error("Error deleting property:", error);
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
        <h3 className="text-lg font-semibold truncate">{propertyType}</h3>
        <p className="text-gray-500 text-sm truncate">
          {city}, {country}
        </p>
        <div className="flex justify-between items-center mt-1 relative">
          <span className="text-lg font-bold">
            ₹{price}/<span className="text-red-200 font-thin">night</span>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
      </div>
    </div>
  );
};

export default PropertyCard;
