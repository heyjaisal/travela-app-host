const Booking = require("../models/booking");
const Ticket = require('../models/Ticket');
const Events = require("../models/events");
const Property = require("../models/housing");

exports.BookedListings = async (req, res) => {
    try {
      const { type, page = 1, limit = 6 } = req.query;
      const userId = req.userId;
  
      if (!type) {
        return res.status(400).json({ message: "Listing type is required" });
      }
  
      const skip = (Number(page) - 1) * Number(limit);
      let listings = [];
      let totalListings = 0;
  
      if (type === "property") {
        totalListings = await Booking.countDocuments({ hostId: userId });
        listings = await Booking.find({ hostId: userId  })
          .sort({ createdAt: -1 })
          .select("_id checkIn checkOut guests totalAmount paymentStatus transactionId platformFee isCheckedIn")
          .populate("property", "propertyType title price country city images")
          .populate("hostId", "username image")
          .skip(skip)
          .limit(Number(limit))
          .lean();
      } else if (type === "event") {
        totalListings = await Ticket.countDocuments({ hostId: userId });
        listings = await Ticket.find({hostId: userId  })
          .sort({ createdAt: -1 })
          .select("_id ticketsBooked totalAmount bookingStatus paymentStatus refundStatus isCheckedIn transactionId")
          .populate("hostId", "username image")
          .populate("event", "eventType title eventVenue ticketPrice country city images")
          .skip(skip)
          .limit(Number(limit))
          .lean();
      }
  
      const hasMore = skip + listings.length < totalListings;
  
      res.json({ listings, hasMore, type });
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
exports.getItemsByType = async (req, res) => {
    try {
      const { type } = req.query;
      const Model = type === "property" ? Property : Events;
  
      const fields =
        type === "property"
          ? "_id country city propertyType price images"
          : "_id eventType title ticketPrice city country images";
  
      const response = await Model.find({ host: req.userId }).select(fields).lean();
  
      res.status(200).json(response);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      res.status(500).json({ message: `Error fetching ${type}`, error: error.message });
    }
  };

exports.detailList = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  let item;

  try {
    if (type === "event") {
      item = await Events.findById(id)
        .populate(
          "host",
          "username image email firstName lastName profileSetup stripeAccountId"
        )
        .lean();
     
      item.features = Array.isArray(item.features) ? item.features : [];
      item.images = Array.isArray(item.images) ? item.images : [];
    } else if (type === "property") {
      item = await Property.findById(id)
        .populate(
          "host",
          "username image email firstName lastName stripeAccountId"
        )
        .lean();

      item.features = Array.isArray(item.features) ? item.features : [];
      item.images = Array.isArray(item.images) ? item.images : [];

  
      const bookings = await Booking.find({
        property: id,
        bookingStatus: "confirmed",
      }).select("checkIn checkOut");

      item.bookedDates = bookings.map(({ checkIn, checkOut }) => ({
        checkIn: checkIn.toISOString().split("T")[0],
        checkOut: checkOut.toISOString().split("T")[0],
      }));
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    if (!item) {
      return res.status(404).json({ error: `${type} not found` });
    }

    res.json({ item });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};
  
  exports.DeletebyType = async (req, res) => {
    try {
      const { type } = req.body;
      const itemId = req.params.id;
  
      const Model = type === "property" ? Property : Events;
  
      const item = await Model.findById(itemId);
  
      if (!item) {
        return res.status(404).json({ message: `No ${type} found` });
      }
  
      if (item.host.toString() !== req.userId) {
        return res.status(403).json({ message: `You are not authorized to delete this ${type}` });
      }
      await item.deleteOne()
      res.status(200).json({ message: `${type} deleted successfully` });
  
    } catch (error) {
      res.status(500).json({ message: "Error deleting item", error: error.message });
    }
  };

exports.getBookingDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    if (!type || !["property", "event"].includes(type)) {
      return res.status(400).json({ message: "Valid type is required (property or event)" });
    }

    let booking;

    if (type === "property") {
      booking = await Booking.findById(id)
        .select("_id checkIn checkOut guests totalAmount transactionId platformFee isCheckedIn qrCode createdAt")
        .populate("property", "propertyType title description price country city address images amenities")
        .populate("hostId", "username email image phone")
        .lean();
    } else if (type === "event") {
      booking = await Ticket.findById(id)
        .select("_id ticketsBooked totalAmount bookingStatus paymentStatus refundStatus isCheckedIn transactionId qrCode createdAt")
        .populate("event", "eventType title description eventVenue ticketPrice country city date time images")
        .populate("hostId", "username email image phone")
        .lean();
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ type, booking });
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



