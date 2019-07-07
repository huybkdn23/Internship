const mongoose  = require("mongoose");
const bcrypt    = require("bcrypt");

var schemaUSer = new mongoose.Schema({
  usr: {
    type: String,
    required: true,
    minlength: [5, "The minimum allowed length is 5 character"],
    unique: true
  },
  pwd: {
    type: String,
    required: true,
    minlength: [6, "The minimum allowed length is 6 character"],
    select: true,
    validate: {
      validator: (v) => {
        var checkUppercase = false, checkNumber = false;
        v.split("",v.length).forEach(element => {
          if(element>='A' && element<='Z') {checkUppercase = true;}
          if(!isNaN(element)) checkNumber = true;
        })
        return checkNumber && checkUppercase;
      },
      message: "The minimum allowed 1 Number, 1 Upper"
    }
  },
  status: {
    type: Boolean,
    default: false
  }
});

schemaUSer.methods.verifyPassword = function(password) {
  var check = bcrypt.compareSync(password, this.pwd);
  return check;
}

var collectionUser = mongoose.model("User", schemaUSer);
module.exports = collectionUser;