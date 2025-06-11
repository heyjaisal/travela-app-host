const jwt = require("jsonwebtoken");
const Host = require("../models/Hosts");
const Otp = require("../models/otp");
const bcrypt = require("bcrypt");
const transporter  = require("../config/nodemailer");


require("dotenv").config()


const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  const { email ,username} = req.body;

  try {

    const existingEmail = await Host.findOne({ email });

    const existingName = await Host.findOne({ username });

 
    if (existingName) {
      return res.status(403).json({ message: "Username already exists" });
    }
    if (existingEmail) {
      return res.status(403).json({ message: "Email already exists" });
    }

    const otp = generateOtp();

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

    await Host.create({
      username,
      email,
      password: hashedPassword,
    });

    await Otp.deleteOne({ email });

    res.status(201).json({ message: "Signup Successful" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Error verifying OTP" });
  }
};
exports.userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await Host.findOne({ email }).select('+password');


    // if (user.isResticted)
    //   return res
    //     .status(403)
    //     .json({ message: "Your account is restricted from logging in." });


    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).send("The password is incorrect");
    }
    

    const token = jwt.sign({ email: user.email, userId: user._id ,role:user.role}, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("tokens", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30 * 5 * 1000, 
      path: '/',
    });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        username: user.username,
        country: user.country,
        street: user.street,
        city: user.city,
        phone: user.phone,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};


exports.updateprofile = async (req, res) => {
  const { firstName, lastName, username, street, country, city, phone, gender } = req.body;

  if (!firstName || !country || !city || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (phone && phone.length > 10) {
    return res.status(400).json({ message: "Phone number must be 10 digits or less" });
  }

  try {
    const user = await Host.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;
    user.country = country || user.country;
    user.city = city || user.city;
    user.phone = phone || user.phone;
    user.street = street || user.street;
    user.gender = gender || user.gender;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getHost = async (req, res) => {
  try {
    const user = await Host.findById(req.userId);

    if (!user) return res.status(404).send("USER NOT FOUND");
  

    return res.status(200).json({
      id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,  
      image: user.image,
      username: user.username,
      country: user.country,
      street: user.street,
      city: user.city,
      phone: user.phone,
      gender: user.gender,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};



exports.logout = async (req, res) => {
  try {
    res.cookie("tokens", "", { maxAge: 1, secure: true, sameSite: "None" });

    return res.status(200).send("Logout Succesfull");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
