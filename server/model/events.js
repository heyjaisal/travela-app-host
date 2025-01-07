const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: [
      'concert', 'conference', 'workshop', 'seminar', 'meetup', 'party', 
      'festival', 'wedding', 'webinar', 'charity-event', 'other'
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  eventVenue: {
    type: String,
    required: true,
    trim: true,
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
  ticketsSold: {
    type: Number,
    default: 0,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
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
    trim: true,
  },
  features: [{
    text: {
      type: String,
      required: true,
      trim: true,
    },
  }],
  couponCode: {
    type: String,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',  
    required: true,
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
