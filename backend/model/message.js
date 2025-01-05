const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recieverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text:{
    type:String
  },
  conversationId:{
    type: mongoose.Schema.Types.ObjectId,
  }
},{
  timestamps:true
});

module.exports = mongoose.model("Message", messageSchema);