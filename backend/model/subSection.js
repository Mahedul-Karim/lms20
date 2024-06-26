const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    public_id:{
      type:String
    },
    url:{
      type:String
    }
  },
 
});

module.exports = mongoose.model("SubSection", subSectionSchema);
