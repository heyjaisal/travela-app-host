const Host = require("../model/profile");
const Event = require("../model/events");
const Property = require("../model/housing");
const s3 = require("../config/aws-s3");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

exports.addProperty = async (req, res) => {
  try {
    const { house, features } = req.body;

    console.log(req.body);
    
    const userId = req.user.id;

    const newProperty = new Property({
      ...house,
      features:features,
      host: userId,
    });

    await newProperty.save();

    res
      .status(201)
      .json({ message: "Property added successfully", property: newProperty });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Failed to add property",
        error: error.message || "Unknown error",
      });
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
    res.status(500).json({ error: "Failed to save event" });
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

exports.getHost = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Host.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const key = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    await s3.putObject(params).promise();

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    res.json({ imageUrl: fileUrl });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

exports.getEvents = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  
  try {
    
    const hostedEvents = await Event.find({ host: userId});
    console.log(hostedEvents);
    
    
    if (!hostedEvents.length) {
      return res.status(404).json({ message: 'No events found for this host' });
    }

    res.status(200).json(hostedEvents);
  } catch (error) {
    console.error("Error fetchind events details: ",error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHouse = async (req,res) =>{
  const userId = req.user.id;
  console.log(userId);

  try{
    const houses = Property.find({host:userId})
    
  

    

  if(!houses.length){
    return res.status(404).json({message : 'No House found'})
  }
  res.status(200).json(houses)

  }catch(error){
    console.error("Error fetching house details:",error);
    res.status(500).json({ message: 'Server error' });

  }

}