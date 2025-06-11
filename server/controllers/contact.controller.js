const mongoose = require('mongoose')
const Host = require("../models/Hosts")
const Message = require("../models/messags")

exports.searchContact = async (req, res) => {
    try {
  
      const {searchTerm} = req.body;

      if(searchTerm === undefined || null){
        return res.status(400).send("Search term is required")
      }
      const sanitize = searchTerm.replace(
        /[.*+?^${}|[\]\\]/g,
        "\\$&"
      )
      const regex = new RegExp(sanitize,"i");

      const contacts = await Host.find({
        $and:[{
            _id:{$ne:req.userId}
        },{
            $or:[{firstName:regex},{lastName:regex},{email:regex}]
        }]
      })
      return res.status(200).json({contacts})
     
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server Error");
    }
  };

exports.contactList = async (req, res) => {
    try {
      let {userId} = req;

      userId = new mongoose.Types.ObjectId(userId);

      const contacts = await Message.aggregate([
        {
          $match:{
            $or:[{sender:userId},{recipient:userId}]
          }
        },{
          $sort:{
            timestamp:-1
          }
        },
        {
          $group:{
            _id:{
              $cond:{
                if:{$eq:["$sender",userId]},
                then:"$recipient",
                else:"$sender"
              }
            },
            lastMessaageTime:{$first: "$timestamp"},
          }
        },{
          $lookup:{
            from:"users",
            localField:"_id",
            foreignField:"_id",
            as:"contactInfo"
          }
        },{
          $unwind:"$contactInfo"
        },{
          $project:{
            _id:1,
            lastMessaageTime:1,
            email:"$contactInfo.email",
            firstName:"$contactInfo.firstName",
            lastName:'$contactInfo.lastName',
            image:"$contactInfo.image"
          }
        },{
          $sort:{
            lastMessaageTime:-1
          }
        }
      ])
      return res.status(200).json({contacts});
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server Error");
    }
  };
  
exports.getAllcontact = async (req, res) => {
    try {

      const user = await Host.find({_id: {$ne:req.userId}},"firstName lastName _id email")

      const contacts = user.map((user)=>({
        label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
        value:user._id
      }))
  
      return res.status(200).json({contacts})
     
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server Error");
    }
  };
  
  