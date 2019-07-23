const mongoose  = require('mongoose');

const schemaBoard = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name board is required!']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: mongoose.Schema.Types.ObjectId,
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  }]
});

schemaBoard.methods.isCreatedBy = function(user) {
  return this.createdBy.toString() === user._id.toString();
}

schemaBoard.methods.verifyUser = function(user) {
  user.hashPassword = undefined;
  var index = this.members.indexOf(user.toString());
  if (index < 0) return false;
  return true;
}

schemaBoard.methods.verifyId = function(id) {
  for (let i = 0, length = this.members.length; i < length; i++) {
    if (this.members[i]._id.toString() === id) return true;
  }
  return false;
}

schemaBoard.methods.getIndexOf = function(user) {
  return this.members.indexOf(user.toString());
}

schemaBoard.methods.removeCards = function(card) {
  let index = this.cards.indexOf(card);
  if (index < 0) return;
  this.cards.splice(index, 1);
}

module.exports = mongoose.model('Board', schemaBoard);