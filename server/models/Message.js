const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      model: { type: String, enum: ["User", "Host"], required: true },
    },
    receiver: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      model: { type: String, enum: ["User", "Host"], required: true },
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
