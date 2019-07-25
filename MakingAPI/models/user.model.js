const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const MyError   = require('../errors/myError.js');

const schemaUser = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    minlength: [5, 'The minimum allowed length is 5 character']
  },
  hashPassword: {
    type: String,
    required: true,
    minlength: [6, 'The minimum allowed length is 6 character'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'email is required!'],
    unique: [true, 'email Invalid!']
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  birthDay: Date,
  path: String
});

schemaUser.methods.verifyPassword = function(password) {
  var check = bcrypt.compareSync(password, this.hashPassword);
  return check;
}

schemaUser.methods.verifyID = function(id) {
  if (id !== this._id.toString()) {
    throw new MyError(403, 'You\'re not authorized!');
  }
}

schemaUser.methods.updateUsername = function(username) {
  if (username) this.username = username;
}

schemaUser.methods.updateFirstName = function(firstName) {
  if (firstName) this.firstName = firstName;
}

schemaUser.methods.updateLastName = function(lastName) {
  if (lastName) this.lastName = lastName;
}

schemaUser.methods.updateBirth = function(day) {
  //day can be updated or deleted(incase input = '')
  if (day) {
    let date = new Date(day);
    if (date.getTime() !== date.getTime()) {
      throw new MyError(400, 'Invalid Date!');
    }
    this.birthDay = date;
  }
  else if (day === '') this.birthDay = '';
}
module.exports = mongoose.model('User', schemaUser);