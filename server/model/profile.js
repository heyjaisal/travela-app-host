const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // Ensure unique email addresses
  password: { type: String, required: false },  // Optional for Google sign-ups
  role: { type: String, default: 'host' },  // Default to 'host' role
  country: { type: String, required: false },
  googleId: { type: String },  // For Google OAuth
  verified: { type: Boolean, default: false },  // If the email is verified
  street: { type: String },
  profileImage: { 
    type: String,
    default: '/no-profile-picture.jpg' 
  },
  instname: { type: String },  // Instagram username or other social media
  course: { type: String },  // Course offered by the host (optional)
  city: { type: String }  // City for the host
}, { timestamps: true });  // Add timestamps to automatically handle createdAt and updatedAt fields

const Host = mongoose.model('Host', hostSchema);

module.exports = Host;
