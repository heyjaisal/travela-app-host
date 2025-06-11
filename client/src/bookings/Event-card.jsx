import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const EventCard = ({ event }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const username = event?.hostId?.username || "Unknown Host";
  const image = event?.hostId?.image || "";

  const {
    bookingStatus,
    isCheckedIn,
    paymentStatus,
    qrCode,
    refundStatus,
    ticketsBooked,
    totalAmount,
    transactionId,
  } = event;

  const { images, eventVenue, ticketPrice, country, city } = event.event;

  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleClick = () => {
    navigate(`/booking/event/${event._id}`);
  };

  // Color-coded badge styles based on paymentStatus
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
              alt={`Event ${index + 1}`}
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
        <h3 className="text-lg font-semibold truncate">{eventVenue}</h3>
        <p className="text-gray-500 text-sm truncate">
          {city}, {country}
        </p>
        <span className="text-lg font-bold">
          ₹{ticketPrice}/<span className="text-red-200 font-thin">ticket</span>
        </span>
      </div>
    </div>
  );
};

export default EventCard;
