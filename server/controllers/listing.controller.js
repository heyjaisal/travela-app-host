const Booking = require("../model/booking");
const Ticket = require('../model/Ticket');
const Events = require("../model/events");
const Property = require("../model/housing");


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
          .select("_id checkIn checkOut guests totalAmount transactionId qrCode platformFee isCheckedIn")
          .populate("property", "propertyType title price country city images")
          .populate("hostId", "username image")
          .skip(skip)
          .limit(Number(limit))
          .lean();
      } else if (type === "event") {
        totalListings = await Ticket.countDocuments({ hostId: userId });
        listings = await Ticket.find({hostId: userId  })
          .sort({ createdAt: -1 })
          .select("_id ticketsBooked totalAmount bookingStatus paymentStatus refundStatus qrCode isCheckedIn transactionId")
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