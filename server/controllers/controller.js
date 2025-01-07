const jwt = require('jsonwebtoken');
const Host = require('../model/profile')
const Event = require("../model/events")
const Otp = require('../model/otp');
const bcrypt = require('bcrypt');
const { transporter } = require('../config/nodemailer');
const Property = require('../model/housing');
require('dotenv').config();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  console.log(email);
  
  const otp = generateOtp();

  try {
    await Otp.deleteMany({ email });

    await Otp.create({ email, otp });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP Sent Successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
};


exports.verifyOtp = async (req, res) => {
    const { name, email, password, country, otp } = req.body;
    console.log(req.body);
  
    try {
      const otpDoc = await Otp.findOne({ email, otp });
  
      if (!otpDoc) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
  
     
      const otpAge = (new Date() - otpDoc.createdAt) / 1000 / 60; // Age in minutes
      if (otpAge > 5) {
        return res.status(400).json({ error: "Expired OTP" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      await Host.create({ name, email, password: hashedPassword, country, role: 'user', verified: true });
  
      await Otp.deleteOne({ email });
  
      res.status(201).json({ message: "Signup Successful" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Error verifying OTP" });
    }
  };
  
  exports.userlogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        const user = await Host.findOne({ email, role: 'user' });
        if (!user) {
            return res.status(400).json({ error: 'email not found' });
        }

        const passvalid = await bcrypt.compare(password, user.password);
        if (!passvalid) {
            return res.status(400).json({ error: 'invalid password' });
        }

        const token = jwt.sign(
            {
                user: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        // Set the JWT token in a session cookie
        res.cookie('auth_token', token, {
            httpOnly: true,  // Ensures the cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production',  // Use secure cookies only over HTTPS
            sameSite: 'Strict',  // Prevents CSRF attacks
            maxAge: 3600000,  // 1 hour expiration time
        });

        res.status(200).json({
            message: 'login successful',
            user: { name: user.name, email: user.email, country: user.country },
        });
    } catch (error) {
        console.error('error logging in', error);
        res.status(400).json({ error: 'error logging in' });
    }
};

exports.addProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    console.log(propertyData);
    
    
    if (!propertyData.address) {
      return res.status(400).json({ message: 'address feild is required' });
    }
    if (!propertyData.propertyType) {
      return res.status(400).json({ message: 'propertyType feild is required' });
    }
    if (!propertyData.size) {
      return res.status(400).json({ message: 'size feild is required' });
    }
    if (!propertyData.price) {
      return res.status(400).json({ message: 'price feild is required' });
    }
    if (!propertyData.description) {
      return res.status(400).json({ message: 'description feild is required' });
    }
    if (!propertyData.location) {
      return res.status(400).json({ message: 'location feild is required' });
    }

    const newProperty = new Property(propertyData);
    await newProperty.save();
    
    res.status(201).json({ message: 'Property added successfully', property: newProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add property', error: error.message });
  }
};

exports.eventproperty = async (req, res) => {
  const { event, features } = req.body;

  console.log(req.body);

  // Access the user._id from the middleware (req.user)
  const userId = req.user._id;  // This should have been set in the authenticate middleware

  // Save event and features to the database
  const newEvent = new Event({
    ...event,  // event data
    features: features,  // features list
    host: userId,  // Set the host to the user's ID
  });

  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save event" });
  }
};