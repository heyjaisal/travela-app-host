const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'studio', 'villa', 'other'],
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 1,
  },
  kitchen: {
    type: Number,
    required: true,
    min: 1,
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 1,
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  maxStay: {
    type: Number,
    required: true,
    min: 1,
  },
  location: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;