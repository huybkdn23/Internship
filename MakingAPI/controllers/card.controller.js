const collectionUser    = require("../models/user.model.js");
const collectionCard    = require("../models/card.model.js");
const collectionBoard   = require("../models/board.model.js");

module.exports = {
  postCard: function(req, res, next) {
    //Get title from body
    var user = req.user;
    var boardId = req.params.boardId;
    var title = req.body.title;
    //Check if user is exist in board before add card
    collectionBoard.findById(boardId)
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {
        res.status(404).json({success: false, message: "Not found board!"}); 
        return;
      }
      var index = board.members.indexOf(user._id);
      if (index < 0) {
        res.status(403).status({success: false, message: "You're not in board to add the card"}); 
        return;
      }
      var card = new collectionCard({title: title});
      card.save((err, cardSaved) => {
        if (err) return next(new Error(err));
        board.cards.push(cardSaved);
        board.save();
        res.status(200).json({success: true, data: cardSaved});
      });
    });
  },
//Add or update attribute
  updateTitDesDueMem: function(req, res, next) {
    //Get title, description, dueDate, member from body
    var user = req.user;
    var cardId  = req.params.cardId;
    collectionBoard.findOne({cards: cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {
        res.status(404).json({success: false, message: "Not found card!"}); 
        return;
      }
      //Check if user is exist in board before update card
      if (!board.verifyUser(user)) {
        res.status(403).json({success: false, message: "You're not in board to update!"}); 
        return;
      }
      //Get index of card in board to update
      var index = board.getIndexOfCard(cardId);
      //title only update
      if (req.body.title) board.cards[index].title = req.body.title;
      //description can be update or deleted (incase input = "")
      if (req.body.description) board.cards[index].description = req.body.description;
      else board.cards[index].description = "";
      //dueDate can be updated or deleted(incase input = "")
      if (req.body.dueDate) board.cards[index].dueDate = new Date(req.body.dueDate);
      else board.cards[index].dueDate = "";
      
      //Check if member is exist in the card, they are removed on card. Else they are pushed on card
      //Member can be added or deleted
      if (req.body.member) {
        collectionUser.findOne({username:req.body.member}).exec((err, user) => {
          if (err) return next(new Error(err.message));
          if (!user) {res.status(404).json({success:false, message:"Not found user!"}); return;}
          var index2 = board.cards[index].members.indexOf(user._id);
          if (index2 < 0) board.cards[index].members.push(user);
          else board.cards[index].members.splice(index2,1);
          board.cards[index].save((err, cardSaved) => {
            if (err) return next(new Error(err.message));
            res.status(200).json({success:true, message:"Update card successful!", data:cardSaved});
          });
        });
      }
      else {
        board.cards[index].save((err, cardSaved) => {
          if (err) return next(new Error(err.message));
          res.status(200).json({success:true, message:"Update card successful!", data:cardSaved});
        });
      }
    });
  },

  deleteCard: function(req, res, next) {
    var user = req.user;
    var cardId  = req.params.cardId;
    collectionBoard.findOne({cards: cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {res.status(404).json({success:false, message:"Not found board!"}); return;}
      //Check if user is exist in board before delete card
      if (!board.verifyUser(user)) {
        res.status(403).status({success: false, message: "You're not in board to delete the card"}); 
        return;
      }
      //Get index of card in board 
      var index = board.getIndexOfCard(cardId);
      board.cards[index].remove((err, cardRemoved) => {
        if (err) return next(new Error(err.message));
        board.cards.splice(index,1);
        board.save((err, boardSaved) => {
          res.status(200).json({success:true, message:"Delete card successful!", data: boardSaved});
        });
      });
    });
  },

  addComment: function(req, res, next) {
    //Get comment from body
    var user = req.user;
    var cardId  = req.params.cardId;
    collectionBoard.findOne({cards: cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {
        res.status(404).json({success: false, message: "Not found card!"}); 
        return;
      }
      //Check if user is exist in board before delete card
      if (!board.verifyUser(user)) {
        res.status(403).status({success: false, message: "You're not in board to add the comment!"}); 
        return;
      }
      //Get index of card in board 
      var index = board.getIndexOfCard(cardId);
      //Comment can be add
      if (req.body.comment) {
        //get index of user in board when they comment
        var i = board.members.indexOf(user._id);
        board.cards[index].comments.push({
          content: req.body.comment,
          whoComment: i
        }); 
        board.cards[index].save((err, cardSaved) => {
          if (err) return next(new Error(err.message));
          res.status(200).json({success:true, message:"Update card successful!", data:cardSaved});
        });
      }
    });
  },

  updateComment: function(req, res, next) {
    var user = req.user;
    var cardId = req.params.cardId;
    //Index of card and user saved in board
    var indexCard;
    var indexUser;
    //get index of comment and newComment from body
    var indexCmt = req.body.indexComment;
    var newComment = req.body.newComment;
    collectionBoard.findOne({cards:cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {res.status(404).json({success:false, message:"Not found board!"}); return;}
      //Check user is exist in board before update comment
      indexUser = board.members.indexOf(user._id);
      if (indexUser < 0) {
        res.status(403).json({success: false, message: "You're not in this board to update the comment!"});
         return;
        }
      //Get index of card in board 
      indexCard = board.getIndexOfCard(cardId);
      //Check who comments
      if (board.cards[indexCard].comments[indexCmt].whoComment === indexUser) {
        board.cards[indexCard].comments[indexCmt].content = newComment;
        board.cards[indexCard].save((err, cardSaved) => {
          if (err) return next(new Error(err.message));
          res.status(200).json({success :true, message: "Update comment successful!", data:cardSaved});
        });
      }
      else res.status(403).json({success:false, message:"You're not allowed to update this comment!"}); 
    });
  },

  deleteComment: function(req, res, next) {
    var user = req.user;
    var cardId = req.params.cardId;
    //Index of card and user saved in board
    var indexCard;
    var indexUser;
    //get index of comment from body
    var indexCmt = req.body.indexComment;

    collectionBoard.findOne({cards:cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {res.status(404).json({success:false, message:"Not found board!"}); return;}
      //Check user is exist in board before delete comment
      indexUser = board.members.indexOf(user._id);
      if (indexUser < 0) {
        res.status(403).json({success:false, message:"You're not in this board to delete the comment!"}); 
        return;
      }
      //Get index of card in board 
      indexCard = board.getIndexOfCard(cardId);
      console.log(indexCard);
      
      //Check who comments
      if (board.cards[indexCard].comments[indexCmt].whoComment === indexUser || 
          board.permissions[indexUser]) {
        //remove comment and who comments
        board.cards[indexCard].comments.splice(indexCmt,1);
        board.cards[indexCard].save((err, cardSaved) => {
          if (err) return next(new Error(err.message));
          res.status(200).json({success:true, message:"Delete comment successful!", data:cardSaved});
        });
      }
      else res.status(403).json({success:false, message:"You're not allowed to delete this comment!"}); 
    });
  },

  addTask: function(req, res, next) {
    //Get taskName from body
    var user = req.user;
    var cardId  = req.params.cardId;
    collectionBoard.findOne({cards: cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {
        res.status(404).json({success: false, message: "Not found card!"}); 
        return;
      }
      //Check if user is exist in board before delete card
      if (!board.verifyUser(user)) {
        res.status(403).status({success: false, message: "You're not in board to delete the card"}); 
        return;
      }
      //Get index of card in board 
      var index = board.getIndexOfCard(cardId);
      //Add nameTask
      if (req.body.taskName) {
        board.cards[index].tasks.push({taskName: req.body.taskName});
        board.cards[index].save((err, cardSaved) => {
          if (err) return next(new Error(err.message));
          res.status(200).json({success:true, message:"Update card successful!", data:cardSaved});
        });
      }
    });
  },

  updateTaskName: function(req, res, next) {
    var user = req.user;
    var cardId = req.params.cardId;
    //Index of card and user saved in board
    var indexCard;
    var indexUser;
    //Get index of task, newTaskName from body
    var indexTask = req.body.indexTask;
    var newTaskName = req.body.newTaskName;
    collectionBoard.findOne({cards:cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {res.status(404).json({success:false, message:"Not found board!"}); return;}
      //Check of user is exist in board before updating taskName
      indexUser = board.members.indexOf(user._id);
      if (indexUser < 0) {
        res.status(403).json({success:false, message:"You're not in this board to update task name!"}); 
        return;
      }
      //Get index of card in board 
      indexCard = board.getIndexOfCard(cardId);
      board.cards[indexCard].tasks[indexTask].taskName = newTaskName;
      console.log(board.cards[indexCard].tasks[indexTask].taskName);
      
      board.cards[indexCard].save((err, cardSaved) => {
        res.status(200).json({success:true, message:"Update task name successful!", data:cardSaved});
      });
    });
  },

  deleteTask: function(req, res, next) {
    var user = req.user;
    var cardId = req.params.cardId;
    //Index of card and user saved in board
    var indexCard;
    var indexUser;
    //Get index of task, from body
    var indexTask = req.body.indexTask;
    collectionBoard.findOne({cards:cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {res.status(404).json({success:false, message:"Not found board!"}); return;}
      //Check of user is exist in board before deleting task
      indexUser = board.members.indexOf(user._id);
      if (indexUser < 0) {
        res.status(403).json({success:false, message:"You're not in this board to delete task!"}); 
        return;
      }
      //Get index of card in board 
      indexCard = board.getIndexOfCard(cardId);
      board.cards[indexCard].tasks.splice(indexTask,1);
      board.cards[indexCard].save((err, cardSaved) => {
        res.status(200).json({success:true, message:"Delete task successful!", data:cardSaved});
      });
    });
  },

  addContentTask: function(req, res, next) {
    var user = req.user;
    var cardId = req.params.cardId;
    //Index of card and user saved in board
    var indexCard;
    var indexUser;
    //Get index of task, content from body
    var indexTask = req.body.indexTask;
    var content = req.body.content;
    collectionBoard.findOne({cards:cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {res.status(404).json({success:false, message:"Not found board!"}); return;}
      //Check of user is exist in board before deleting task
      indexUser = board.members.indexOf(user._id);
      if (indexUser < 0) {
        res.status(403).json({success:false, message:"You're not in this board to add content task!"}); 
        return;
      }
      //Get index of card in board 
      indexCard = board.getIndexOfCard(cardId);
      board.cards[indexCard].tasks[indexTask].contents.push(content);
      board.cards[indexCard].save((err, cardSaved) => {
        res.status(200).json({success:true, message:"Add content task successful!", data:cardSaved});
      });
    });
  },

  updateContentTask: function(req, res, next) {
    var user = req.user;
    var cardId = req.params.cardId;
    //Index of card and user saved in board
    var indexCard;
    var indexUser;
    //Get index of task, index of content and newContent from body
    var indexTask = req.body.indexTask;
    var indexContent = req.body.indexContent;
    var newContent = req.body.newContent;
    collectionBoard.findOne({cards:cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {res.status(404).json({success:false, message:"Not found board!"}); return;}
      //Check of user is exist in board before deleting task
      indexUser = board.members.indexOf(user._id);
      if (indexUser < 0) {
        res.status(403).json({success:false, message:"You're not in this board to update content task!"}); 
        return;
      }
      //Get index of card in board
      indexCard = board.getIndexOfCard(cardId);
      board.cards[indexCard].tasks[indexTask].contents[indexContent] = newContent;
      board.cards[indexCard].tasks[indexTask].markModified('contents');
      board.cards[indexCard].save((err, cardSaved) => {
        res.status(200).json({success:true, message:"Update content task successful!", data:cardSaved});
      });
    });
  },

  deleteContentTask: function(req, res, next) {
    var user = req.user;
    var cardId = req.params.cardId;
    //Index of card and user saved in board
    var indexCard;
    var indexUser;
    //Get index of task, indexContent of content from body
    var indexTask = req.body.indexTask;
    var indexContent = req.body.indexContent;
    collectionBoard.findOne({cards:cardId})
    .populate("cards")
    .exec((err, board) => {
      if (err) return next(new Error(err.message));
      if (!board) {res.status(404).json({success:false, message:"Not found board!"}); return;}
      //Check of user is exist in board before deleting task
      indexUser = board.members.indexOf(user._id);
      if (indexUser < 0) {res.status(403).json({success:false, message:"You're not in this board to delete task name!"}); return;}
      //Get index of card in board 
      indexCard = board.getIndexOfCard(cardId);
      board.cards[indexCard].tasks[indexTask].contents.splice(indexContent,1);
      board.cards[indexCard].save((err, cardSaved) => {
        res.status(200).json({success:true, message:"Delete content task successful!", data:cardSaved});
      });
    });
  },

  getFullTaskInCard: function(req, res, next) {
    var cardId = req.params.cardId;
    collectionCard.findById(cardId).exec((err, card) => {
      if (err) return next(new Error(err.message));
      if (!card) {
        res.status(404).json({success: false, message: "Not found card!"});
        return;
      }
      res.status(200).json({
        success: true,
        message: "Get task in card",
        data: card.tasks
      });
    });
  },

  getFullCommentInCard: function(req, res, next) {
    var cardId = req.params.cardId;
    collectionCard.findById(cardId).exec((err, card) => {
      if (err) return next(new Error(err.message));
      if (!card) {
        res.status(404).json({success: false, message: "Not found card!"});
        return;
      }
      res.status(200).json({
        success: true,
        message: "Get comment in card",
        data: card.comments
      });
    });
  },

  getInCard: function(req, res, next) {
    var cardId = req.params.cardId;
    collectionCard.findById(cardId).exec((err, card) => {
      if (err) return next(new Error(err.message));
      if (!card) {
        res.status(404).json({success: false, message: "Not found card!"});
        return;
      }
      res.status(200).json({
        success: true,
        message: "Get comment in card",
        data: card
      });
    });
  }
}