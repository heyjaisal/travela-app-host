const Events = require("../model/events");
const Property = require("../model/housing");
const cloudinary = require('../config/cloudinary')
const Host = require("../model/profile")
const Housing = require("../model/housing")

require("dotenv").config();

exports.handleRequest = async (req, res) => {
  try {
    const { data, type } = req.body;
    const userId = req.userId;

    const user = await Host.findOne({userId});

    // if(user.profileSetup){
    //   return res.status(400).json({ error: "Complete your profile and connect to payment to list" });
    // }

    const Model = type === "property" ? Property : Events;

    const newItem = new Model({
      ...data,
      host: userId,
    });

    await newItem.save();
    res.status(201).json({ message: `${type} added successfully`, item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Failed to add`, error: error.message || "Unknown error" });
  }
};


exports.uploadImage = async (req, res) => {
  const files = req.files?.length ? req.files : req.file ? [req.file] : [];

  if (!files.length) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const folder = {
    profile: "profile-images",
    event: "event-images",
    housing: "housing-images",
  }[req.body.type] || "default-images";

  try {
    const uploads = await Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder }, (err, result) =>
            err ? reject(err) : resolve(result)
          ).end(file.buffer);
        })
      )
    );

    const images = uploads.map(({ secure_url, public_id }) => ({ imageUrl: secure_url, public_id }));
    res.status(200).json({ images, type: req.body.type });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};





exports.deleteImage = async (req, res) => {
  try {
    const { image, type } = req.body;
    
    if (!image || !type) return res.status(400).json({ message: "No image or type provided" });

    const models = { profile: Host, event: Events, housing: Housing };
    const model = models[type];
    if (!model) return res.status(400).json({ message: "Invalid type" });

    const record = await model.findById(req.userId);
    const publicId = image.split("/").pop().split(".")[0];
    const folder = `${type}-images`;

    if (record?.image === image) {
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      await model.findByIdAndUpdate(req.userId, { image: null }, { new: true });
      return res.status(200).json({ message: "Image deleted from both database and Cloudinary" });
    }

    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    return res.status(200).json({ message: "Image deleted from Cloudinary" });

  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getItems = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.userId;
    const Model = type === "property" ? Property : Events;
    const items = await Model.find({ user: userId });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Failed to fetch ${type}s` });
  }
};