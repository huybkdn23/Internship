const mongoose  = require("mongoose");

const schemaCard = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  dueDate: Date,
  // board: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Board"
  // },
  tasks: [{
    taskName: String,
    contents: [String],
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [{
    content: String,
    whoComment: Number
  }]
});

module.exports = mongoose.model("Card", schemaCard);