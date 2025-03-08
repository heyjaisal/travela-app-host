const Events = require("../model/events");
const Property = require("../model/housing");

exports.getItemsByType = async (req, res) => {
  try {
    const { type } = req.query;
    const Model = type === "property" ? Property : Events;

    const fields =
      type === "property"
        ? "_id country city propertyType price images"
        : "_id eventType title ticketPrice city country images";

    const response = await Model.find({ host: req.userId }).select(fields).lean();

    res.status(200).json(response);
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    res.status(500).json({ message: `Error fetching ${type}`, error: error.message });
  }
};


exports.DeletebyType = async (req, res) => {
  try {
    const { type } = req.body;
    const itemId = req.params.id;

    const Model = type === "property" ? Property : Events;

    const item = await Model.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: `No ${type} found` });
    }

    if (item.host.toString() !== req.userId) {
      return res.status(403).json({ message: `You are not authorized to delete this ${type}` });
    }``
    await item.deleteOne()
    res.status(200).json({ message: `${type} deleted successfully` });

  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};