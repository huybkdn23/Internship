const collectionUser  = require("../models/user.js");
const passport        = require("passport");
const bcrypt          = require("bcrypt");


module.exports = {
  logInGet: (req,res) => {
    res.status(200).send("Log-in Page!");
  },
  signUpGet: (req,res) => {
    res.status(200).send("Sign-up Page!");
  },
  signUpPost: (req,res) => {
    //ma hoa password
    bcrypt.genSalt(10, (err, salt) => {
      if(err) {console.error(err); throw (err);}
      bcrypt.hash(req.body.password, salt, (err, hashCode) => {
        if(err) {console.error(err); return;}
        var user = new collectionUser({usr: req.body.username, pwd: hashCode, status: false});
        //luu user
        user.save((err, data) => {
          if(err) console.error(err.message);
        });
      });
    });
    res.status(200).send("postSignUp");
  },
  authenticatedLogin: passport.authenticate("local.login", {
    successRedirect: "myprofile",
    failureRedirect: "login"
  }),
  isAuthen: (req,res) => {
    if(req.isAuthenticated()) {
      collectionUser.findById(req.user).exec((err,data) => {
        res.status(200).send("My name is " + data.usr);
      });
    }
    else res.status(400).send("You are still not logged, please login before accessing!")
  },
  getList: (req,res) => {
    collectionUser.find({})
    .select("usr")
    .sort({"usr":1})
    .exec((err,data) => {
      res.send(data);
    });
  },
  updateGet: (req,res) => {
    if(req.isAuthenticated()) {
      collectionUser.findOne({usr: req.params.username}).exec((err,data) => {
        if(err) {
          console.error(err);
          return;
        }
        if(data) {
          if(data._id == req.user){
            res.status(200).send("Update my profile");
            return;
          }
          res.status(403).send("You're not allowed access this user.");
          return;
        }
        res.status(404).send("Not found user");
      });
    }
    else {
      res.status(400).send("You are still not logged, please login before accessing!"); 
    }
  },
  updatePut: (req,res) => {
    if(req.isAuthenticated()) {
      collectionUser.findOne({usr: req.params.username}).exec((err,data) => {
        if(err) {
          console.error(err);
          return;
        }
        if(data) {
          console.log("data._id " + data._id + "\nreq.user " + req.user);
          
          if(data._id == req.user) {
            res.status(200).send("You can set new password here");
            return;
          }
          res.status(403).send("You can't set new password for this user");
          return;
        }
        res.status(404).send("Not found user");
      });
    }
    else {
      res.status(400).send("You are still not logged, please login before accessing!");
    }
  }
}
