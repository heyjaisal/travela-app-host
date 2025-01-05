const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      "concert",
      "conference",
      "workshop",
      "seminar",
      "meetup",
      "party",
      "festival",
      "wedding",
      "webinar",
      "charity-event",
      "other",
    ],
  },
  title: {
    type: String,
    required: true,
  },
  eventVenue: {
    type: String,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    required: true,
  },
  eventDateTime: {
    type: Date,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  address: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Host", // Reference to the Host model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
