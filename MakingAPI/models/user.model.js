const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');

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
  birthDay: {
    type: String,
    default: ''
  }
});

schemaUser.methods.verifyPassword = function(password) {
  var check = bcrypt.compareSync(password, this.hashPassword);
  return check;
}

schemaUser.methods.verifyID = function(id) {
  return id === this._id.toString();
}
module.exports = mongoose.model('User', schemaUser);