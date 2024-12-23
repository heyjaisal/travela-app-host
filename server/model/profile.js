const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: String, default: 'host' },
    country: { type: String, required: false },
    googleId: { type: String }, // For Google OAuth
    verified: { type: Boolean, default: false },
    street: { type: String },
    profileImage: { type: String ,
        default: '/no-profile-picture.jpg' 
    },  
    instname: { type: String }, 
    course: { type: String }, 
    city: { type: String } 
});

const Host = mongoose.model('Host', hostSchema);

module.exports = Host;

