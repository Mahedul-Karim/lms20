const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
  courseId:{
    type:mongoose.Schema.ObjectId,
    ref:'Course'
  },
  completedVideos:[
    {
        type:mongoose.Schema.ObjectId,
        ref:"SubSection"
    }
  ]
});

module.exports= mongoose.model("CourseProgress",courseProgressSchema);