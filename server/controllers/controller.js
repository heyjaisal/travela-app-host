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
    const { username, email, password, otp } = req.body;
    console.log(req.body);
  
    try {
      const otpDoc = await Otp.findOne({ email, otp });
  
      if (!otpDoc) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
  
     
      const otpAge = (new Date() - otpDoc.createdAt) / 1000 / 60; 
      if (otpAge > 5) {
        return res.status(400).json({ error: "Expired OTP" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      await Host.create({ username, email, password: hashedPassword, role: 'user', verified: true });
  
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

  
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',  
            maxAge: 60 * 60 * 24 * 7 * 1000,
            path: '/',
  
        });
        res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&role=${user.role}`); 
    } catch (error) {
        console.error('error logging in', error);
        res.status(400).json({ error: 'error logging in' });
    }
};

exports.addProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    const userId = req.user.id; 

    const newProperty = new Property({
      ...propertyData,
      host: userId,
    });

    await newProperty.save();
    
    res.status(201).json({ message: 'Property added successfully', property: newProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add property', error: error.message || 'Unknown error' });
  }
};

exports.eventproperty = async (req, res) => {


  const { event, features } = req.body;

  console.log(req.body);

  const userId = req.user.id;

  console.log(userId);
  

  const newEvent = new Event({
    ...event, 
    features: features, 
    host: userId,
  });

  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save event' });
  }
};

exports.updateprofile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const phoneExists = await Host.findOne({ phone: updatedData.phone });
    if (phoneExists && phoneExists.id !== userId) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const updatedUser = await Host.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};


exports.getHost =  async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await Host.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};