import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

const PropertyCard = ({ images, propertyType, price, country, city, _id, onDelete }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/listing/delete/${_id}`, {
        data: { type: 'property' },
        withCredentials: true
      });
      onDelete(_id);
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative border p-2 rounded-xl shadow-sm bg-white transition-all duration-300"
    >
      <Slider {...settings} className="rounded-xl overflow-hidden">
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

      <div className="mt-3 px-1">
        <h3 className="text-lg font-semibold truncate">{propertyType}</h3>
        <p className="text-muted-foreground text-sm truncate">{city}, {country}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold">
            ₹{price}
            <span className="text-sm font-normal text-muted-foreground"> /night</span>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuItem onClick={() => alert("View Clicked")}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
