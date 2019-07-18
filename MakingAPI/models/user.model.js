const mongoose  = require("mongoose");
const bcrypt    = require("bcrypt");

const schemaUser = new mongoose.Schema({
  username: {
    type: String,
    unique: [true,"Username Invalid!"],
    required: true,
    trim: true,
    minlength: [5, "The minimum allowed length is 5 character"]
  },
  hashPassword: {
    type: String,
    required: true,
    minlength: [6, "The minimum allowed length is 6 character"],
    select: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  birthDay: {
    type: String,
    default: "1/1/1970"
  }
});

schemaUser.methods.verifyPassword = function(password) {
  var check = bcrypt.compareSync(password, this.hashPassword);
  return check;
}
module.exports = mongoose.model("User", schemaUser);