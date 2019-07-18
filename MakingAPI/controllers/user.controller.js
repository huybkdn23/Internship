const collectionUser  = require("../models/user.model.js");
const collectionBoard = require("../models/board.model.js");
const bcrypt          = require("bcrypt");
const jwt             = require("jsonwebtoken");
module.exports = {
  logInGet: (req,res) => {
    res.status(200).json({
      success: true, 
      message: "Log-in Page!"
    });
  },

  signUpGet: (req,res) => {
    res.status(200).json({
      success: true, 
      message: "Sign-up Page!"
    });
  },

  signUpPost: (req,res) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(req.body.password, salt, (err, hashPassword) => {
        if (err) return res.json({success: false, message: "Hash error!"});
        var user = new collectionUser({
          username: req.body.username,
          hashPassword: hashPassword,
          email: Date.now().toString()
        });
        user.save((err, data) => {
          if (err) return res.json({success: false, message: err.message});
          res.status(200).json({message: "Save OK", data: data});
        });
      });
    });
  },

  logInPost: (req,res) => {
    var username = req.body.username;
    var password = req.body.password;
    collectionUser.findOne({username: username})
    .exec((err, user) => {
      if (err) throw err;
      if (!user) res.status(401).json({success: false, message:"User is not exist!"});
      else if (user.verifyPassword(password)) {
        var payload = {username: user.username};
        var token = jwt.sign(payload, process.env.jwtSecret, {expiresIn: '1d'});
        console.log(`Token: ${token}`);
        res.json({success: true, accessToken: token});
      }
      else res.status(401).json({success: false, message: "Login error"});
    });
  },

  updateProfile: function(req,res) {
    var newEmail = "";
    if (!req.body.email) newEmail = Date.now();
    else newEmail = req.body.email;
    if (req.user && req.user.username === req.params.username) {
      collectionUser.findOneAndUpdate({username: req.user.username}, 
                                      {firstName: req.body.firstName, 
                                        lastName: req.body.lastName,
                                        email: newEmail}, 
                                        {new: true,                   //return update value 
                                        runValidators: true})         //validate before update
      .exec((err, data) => {
        if (err) res.json({success: false, message: err.message});
        else { 
          res.status(200).json({
            success: true, 
            data: data
          });
        }
      });
    }
    else res.status(401).json({success: false, message: "User is not authorized!"});
  },

  getUser: function(req, res, next) {
    var username = req.params.username;
    collectionUser.findOne({username: username})
    .select("username firstName lastName email -_id")
    .exec((err, data) => {
      if (err) return next(new Error(err.message));
      if (data) res.status(200).json({success: true, data: data});
      else res.status(404).json({success: false, message: "Not found User!"});
    });
  },

  getUsersInBoard: function(req, res, next) {
    var user = req.user;
    var nameBoard = req.params.name;
    nameBoard = nameBoard.replace(/%20/g, " ");
    collectionBoard.findOne({name:nameBoard})
    .populate("members")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (board) {
        var index = board.members.indexOf(user.toString());
        //Check current user is exist in board
        if (index >= 0) {
          var data = [];
          board.members.forEach((element, i) => {
            //get i because we want to get permission of user
              data.push({username: element.username,
                        firstName: element.firstName,
                        lastName: element.lastName,
                        email: element.email,
                        permission: board.permissions[i]});
          });
          res.status(200).json({success: true, data: data});
        }
        else res.status(403).json({success: false, message: "You're not in this board!"});
      }
      else res.status(404).json({success: false, message: "Not found board!"});
    });
  },

  isAuthenticated: (req,res, next) => {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === "Bearer") {
          var token = req.headers.authorization.split(' ')[1];
          jwt.verify(token, process.env.jwtSecret, (err, payload) => {
            if (err) throw err;
            console.log(`payload.username: ${payload.username}`);
            collectionUser.findOne({username: payload.username})
            .exec((err, data) => {
              if (err) throw err;
              if (data) {req.user = data; next();}
              else res.status(401).json({success: false, message: "User is not authorized!"});
            });
          });
        }
    else {
      res.status(401).json({success: false, message: "User is not authorized!"});
    }
  }
}