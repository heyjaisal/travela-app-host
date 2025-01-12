const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: 'host' },
  country: { type: String },
  googleId: { type: String },
  verified: { type: Boolean, default: false },
  street: { type: String },
  profileImage: { type: String, default: '/no-profile-picture.jpg' },
  instname: { type: String },
  city: { type: String },
  phone:{type:Number},
  gender: { type: String, enum: ['male', 'female'] }
}, { timestamps: true });

const Host = mongoose.model('Host', hostSchema);

module.exports = Host;
