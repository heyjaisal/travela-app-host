import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const {
    images,
    propertyType,
    country,
    city,
    price,
  } = property.property;

  const {
    _id,
    paymentStatus
  } = property;

  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleClick = () => {
    navigate(`/booking/property/${_id}`);
  };

  // Optional: color coding for different payment statuses
  const paymentStatusColors = {
    "on-hold": "bg-yellow-300 text-yellow-900",
    "released": "bg-green-300 text-green-900",
    "refunded": "bg-red-300 text-red-900",
  };

  const paymentStatusClass = paymentStatusColors[paymentStatus] || "bg-gray-200 text-gray-700";
  const paymentStatusLabel = paymentStatus ? paymentStatus.replace("-", " ") : "Not available";

  return (
    <div
      className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer"
      onClick={handleClick}
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

      {/* Payment Status Indicator */}
      <div className={`mt-2 mb-1 px-2 py-1 rounded-md text-sm font-semibold inline-block ${paymentStatusClass}`}>
        Payment: {paymentStatusLabel}
      </div>

      <div className="px-1">
        <h3 className="text-lg font-semibold truncate">{propertyType}</h3>
        <p className="text-gray-500 text-sm truncate">
          {city}, {country}
        </p>
        <div className="flex justify-between items-center mt-1 relative">
          <span className="text-lg font-bold">
            ₹{price}/<span className="text-red-200 font-thin">night</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
