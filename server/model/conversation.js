import mongoose from "mongoose";

const chatschema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Host"
    }],
    message: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
})

const Chats = mongoose.model('Conversation',chatschema)

module.exports = Chats