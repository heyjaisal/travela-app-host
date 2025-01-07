const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: 'host' },
  country: { type: String },
  googleId: { type: String },
  verified: { type: Boolean, default: false },
  street: { type: String },
  profileImage: { type: String, default: '/no-profile-picture.jpg' },
  instname: { type: String },
  course: { type: String },
  city: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Host', hostSchema);
