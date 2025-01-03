const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      "concert", "conference", "workshop", "seminar", "meetup", 
      "party", "festival", "wedding", "webinar", "charity-event"
    ],
  },
  title: { type: String, required: true },
  eventVenue: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
