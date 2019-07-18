const collectionBoard   = require("../models/board.model.js");
const collectionUser    = require("../models/user.model.js");
const collectionCard    = require("../models/card.model.js");
const mongoose          = require("mongoose");

module.exports = {
  getFullBoard: function(req, res, next) {
    var user = req.user;
    //get username on link
    var username = req.params.username;
    if (user.username !== username) {
      res.redirect(`../${user.username}/boards`); 
      return;
    }
    collectionBoard.find({members: user})
    .exec((err, boards) => {
      if (err) return next(new Error(err.message));
      res.status(200).json({success: true, data: boards});
    })
  },

  postBoard: function(req ,res, next) {
    var user = req.user;
    var nameBoard = req.body.nameBoard;
    nameBoard = nameBoard.replace(/%20/g, " ");
    var board = new collectionBoard({name: nameBoard, 
                                    members: user, 
                                    permissions: true});
    board.save((err, boardSaved) => {
      if (err) return next(new Error(err.message));
      res.status(200).json({
        success: true, 
        message: "Save board successful!", 
        data: boardSaved});
    });
  },

  updateNameBoard: function(req, res, next) {
    var user = req.user;
    var nameBoard = req.params.nameBoard;
    nameBoard = nameBoard.replace(/%20/g, " ");
    collectionBoard.findOne({name: nameBoard})
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {
        res.status(404).json({success: false, message: "Not found board!"}); 
        return;
      }
      //Check permission of user
      var index = board.members.indexOf(user._id);
      if (index < 0) {
        res.status(403).json({success: false, message: "You're not in this board!"});
        return;
      }
      console.log(`permission ${board.permissions[index]} and user in board ${board.members[index]}`);
      if (board.permissions[index]) {
        board.name = req.body.nameBoard;
        board.save((err, boardSaved) => {
          res.status(200).json({
            success: true, 
            message: "Update board successful!", 
            data: boardSaved});
        });
      }
      else res.status(403).json({success: false, message: "You're not allowed to change this board!"});
    });
  },

  deleteBoard: function(req, res, next) {
    var user = req.user;
    var nameBoard = req.params.nameBoard;
    nameBoard = nameBoard.replace(/%20/g, " ");
    collectionBoard.findOne({name: nameBoard})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {
        res.status(404).json({success: false, message: "Not found board!"}); 
        return;
      }
      var index = board.members.indexOf(user._id);
      if (index < 0) {
        res.status(403).json({success: false, message: "You're not in this board!"});
        return;
      }
      //find user in board and check permission of user
      if (index >= 0 && board.permissions[index]) {
        //remove all cards in this board
        collectionCard.deleteMany({_id: board.cards}).exec((err) => {});
        board.remove((err, board) => {
          if (err) return next(new Error(err.message));
          res.status(200).json({
            success: true, 
            message: "Delete board successful!", 
            data: board
          });
        });
      }
      else res.status(403).json({success: false, message: "You're not allowed to delete this board!"});
    });
  },

  invite: function(req, res, next) {
    //Get nameOrMail from body
    var user = req.user;
    var nameBoard = req.params.name;
    var nameOrMail = req.body.nameOrMail;
    nameBoard = nameBoard.replace(/%20/g, " ");
    nameOrMail = nameOrMail.replace(/%20/g, " ");
    collectionBoard.findOne({name: nameBoard})
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (board) {
        //Check user is exist in board before invite the others user
        if (board.members.indexOf(user._id) >= 0) {
          collectionUser.findOne({
            $or: [
              {username: nameOrMail}, 
              {email: nameOrMail}
            ]
            }).exec((err, user) => {
            if (err) return next(new Error(err.message));
            if (user) {
              //check if user is invited exist in board
              if (board.members.indexOf(user._id) >= 0 ) {
                res.status(400).json({success: false, message: "User is exist in board"}); 
                return;
              }
              board.members.push(user);
              board.permissions.push(false);
              board.save((err, boardSaved) => {
                res.status(200).json({
                  success: true, 
                  message: "Invited successful!", 
                  data: boardSaved
                });
              });
            }
            else {
              res.status(404).json({success: false, message: "Not found User"}); 
              return;
            }
          });
        }
        else {
          res.status(403).json({success: false, message: "You're not in this board to invite the others user"});
          return;
        }
      }
      else res.status(404).json({success: false, message: "Board not found!"});
    });
  },

  removeUser: function(req, res, next) {
    //Check boardId is exist on url
    var user = req.user;
    var nameBoard = req.params.name;
    var nameOrMail = req.body.nameOrMail;
    nameBoard = nameBoard.replace(/%20/g, " ");
    nameOrMail = nameOrMail.replace(/%20/g, " ");
    collectionBoard.findOne({name: nameBoard})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (board) {
        var index = board.members.indexOf(user._id);
        if (index < 0) {
          res.status(403).json({success: false, message: "You're not in this board!"});
          return;
        }
        //Check permission of user before removing the others user
        if (board.permissions[index]) {
          collectionUser.findOne({
            $or: [
              {username:nameOrMail}, 
              {email:nameOrMail}
            ]
          }).exec((err, userRemoved) => {
            if (!userRemoved) {res.status(404).json({success:false, message:"User not found!"}); return;}
            //Check user removed exist in the board
            var index2 = board.members.indexOf(userRemoved._id);
            if (index2 < 0) {
              res.status(400).json({success:false, message:"User is not in this board!"}); 
              return;
            }
            //remove user in card (member and comment)
            board.cards.forEach(element => {
              index = element.members.indexOf(userRemoved._id);
              if (index >= 0) {
                element.members.splice(index,1);
                element.save();
              }
              element.comments.forEach((comment, indexComment) => {
                if (comment.whoComment === index2) {
                  element.comments.splice(indexComment,1);
                  element.save();
                }
              });
            });
            board.members.splice(index2,1);
            board.permissions.splice(index2,1);
            board.save((err, boardSaved) => {
              res.status(200).json({success:true, message:"Remove successful!", data:boardSaved});
            });
          
          });
        }
        else res.status(403).json({success:false, message:"You're not allowed to remove this user!"});
      }
      else res.status(404).json({success:false, message:"Board not found!"});
    });
  },

  getInBoard: function(req, res, next) {
    var user = req.user;
    //Check input boardId is on link or not
    var boardId = req.params.boardId;
    var nameBoard = req.params.name;
    
    collectionBoard.findById(boardId)
    .populate('members', '-hashPassword')
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {
        res.status(404).json({success: false, message: "Not found page!"}); 
        return;
      }
      //Check user is exist in this board
      user.hashPassword = undefined;
      // console.log(board.members)
      // console.log(user.hashPassword)
      // console.log(board.members.indexOf(user.toString()));
      if (board.members.indexOf(user.toString()) < 0 ) {
        res.status(403).json({success: false, message: "You're not in this board!"}); 
        return;
      }
      if (board.name !== nameBoard) {
        res.redirect(`../${board._id}/${board.name}`); 
        return;
      }
      //Get users and cards in board
      res.status(200).json({
        success: true,
         message: "Welcome to board page!", 
         data: {
           arrUsers: board.members, 
           arrCards: board.cards
          }
      });
    });
  }
}