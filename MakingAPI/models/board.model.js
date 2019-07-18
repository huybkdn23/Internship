const mongoose  = require("mongoose");

const schemaBoard = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Name board is required!"]
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  permissions: [Boolean],
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card"
  }]
});

schemaBoard.methods.verifyUser = function(user) {
  var index = this.members.indexOf(user._id.toString());
  if (index < 0) return false;
  return true;
}

schemaBoard.methods.getIndexOfCard = function(cardId) {
  for(let i = 0; i < this.cards.length; i++) {
    if (this.cards[i]._id.toString() === cardId) return i;
  }
}

module.exports = mongoose.model("Board", schemaBoard);