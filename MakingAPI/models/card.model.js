const mongoose  = require('mongoose');
const MyError   = require('../errors/myError.js');

const schemaCard = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  dueDate: Date,
  // board: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Board'
  // },
  tasks: [{
    taskName: String,
    contents: [String],
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    content: String,
    commentedBy: mongoose.Schema.Types.ObjectId
  }]
});

schemaCard.methods.removeUser = function(member) {
  let index =  this.members.indexOf(member._id);
  if (index >= 0) {
    this.members.splice(index,1);
    this.save();
  }
  this.comments.forEach((comment, indexComment) => {
    if (comment.commentedBy.toString() === member._id) {
      this.comments.splice(indexComment, 1);
      this.save();
    }
  });
}

schemaCard.methods.updateTitle = function(title) {
    //title only update
    if (title) this.title = title;
}

schemaCard.methods.updateDescription = function(description) {
  //description can be update or deleted (incase input = '')
  if (description) this.description = description;
  else if (description === '') this.description = '';
}

schemaCard.methods.updateDueDate = function(dueDate) {
  //dueDate can be updated or deleted(incase input = '')
  if (dueDate) {
    let date = new Date(dueDate);
    if (date.getTime() !== date.getTime()) {
      throw new MyError(400, 'Invalid Date!');
    }
    this.dueDate = new Date(dueDate);
  }
  else if (dueDate === '') this.dueDate = '';
}

schemaCard.methods.updateMember = function(memberId) {
  let indexOfUser = -1;
  for (let i = 0, length = this.members.length; i < length; i++) {
    console.log(this.members[i]);
    if (this.members[i].toString() === memberId) indexOfUser = i;
  }
  if (indexOfUser < 0) this.members.push(memberId);
  else this.members.splice(indexOfUser, 1);
  return this.save();
}

schemaCard.methods.isCommentedBy = function(user, index) {
  return this.comments[index].commentedBy.toString() === user._id.toString();
}

module.exports = mongoose.model('Card', schemaCard);