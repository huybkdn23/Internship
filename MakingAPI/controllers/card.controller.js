const collectionUser    = require('../models/user.model.js');
const collectionCard    = require('../models/card.model.js');
const collectionBoard   = require('../models/board.model.js');
const cardService       = require('../services/card.service.js');

module.exports = {
  createCard,
  getInCard,
  updateTitDesDueMem,
  deleteCard,
  getFullCommentInCard,
  addComment,
  updateComment,
  deleteComment,
  getFullTaskInCard,
  addTask,
  updateTaskName,
  deleteTask,
  addContentTask,
  updateContentTask,
  deleteContentTask
}

/**
* @name createCard
* @description
* Check current user is exist in board before create card
* Do create a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function createCard(req, res, next) {
  //Get title from body
  let board = req.board;
  const title = req.body.title;
  cardService.create(board, title)
  .then(cardSaved => {
    res.status(200).json({message: 'Create card successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(500).json({message: err.message});
  });
}

/**
* @name getInCard
* @description
* Check current user is exist in board
* Do get all information in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getInCard(req, res, next) {
  const id = req.params.cardId;
  cardService.getCard(id)
  .then(card => {
    res.status(200).json({message: 'Get all information of card!', data: card});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name updateTitDesDueMem
* @description
* Check current user is exist in board
* Do update a title, description, dueday, member
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function updateTitDesDueMem(req, res, next) {
  //Get title, description, dueDate, member from body
  const id  = req.params.cardId;
  let board = req.board;
  const title = req.body.title;
  const description = req.body.description;
  const dueDate = req.body.dueDate;
  const memberId = req.body.memberId;
  cardService.updateTitDesDueMem(id, board, title, description, dueDate, memberId)
  .then(cardSaved => {
    res.status(200).json({message: 'Update successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name deleteCard
* @description
* Check current user is exist in board
* Do delete a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function deleteCard(req, res, next) {
  let board = req.board;
  const cardId  = req.params.cardId;
  cardService.deleteCard(cardId, board)
  .then(boardSaved => {
    res.status(200).json({message: 'Delete card successful!', data: boardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name getFullCommentInCard
* @description
* Check current user is exist in board
* Do get all comment in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getFullCommentInCard(req, res, next) {
  const id = req.params.cardId;
  cardService.getComments(id)
  .then(comments => {
    res.status(200).json({message: 'All comments in card!', data: comments});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  })
}

/**
* @name addComment
* @description
* Check current user is exist in board
* Do add a comment
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function addComment(req, res, next) {
  //Get comment from body
  const user = req.user;
  const cardId  = req.params.cardId;
  const comment = req.body.comment;
  cardService.addComment(comment, cardId, user)
  .then(cardSaved => {
    res.status(200).json({message: 'Add comment successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name updateComment
* @description
* Check current user is exist in board
* Check who comments?
* Do update a comment
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function updateComment(req, res, next) {
  const user = req.user;
  const cardId = req.params.cardId;
  //get index of comment from params
  //get newComment from body
  const index = req.params.index;
  const newComment = req.body.comment;
  cardService.updateComment(newComment, index, cardId, user)
  .then(cardSaved => {
    res.status(200).json({message: 'Update comment successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name deleteComment
* @description
* Check current user is exist in board
* Check who comments?
* Do delete comment
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function deleteComment(req, res, next) {
  const user = req.user;
  const board = req.board;
  const cardId = req.params.cardId;
  //get index of comment from params
  const index = req.params.index;
  cardService.deleteComment(index, cardId, user, board)
  .then(cardSaved =>{
    res.status(200).json({message:'Delete comment successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name getFullTaskInCard
* @description
* Check current user is exist in board
* Do get all task in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getFullTaskInCard(req, res, next) {
  const cardId = req.params.cardId;
  cardService.getTasks(cardId)
  .then(tasks => {
    res.status(200).json({message: 'All tasks of card!', data: tasks});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name addTask
* @description
* Check if user is exist in board
* Do create a task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function addTask(req, res, next) {
  const cardId = req.params.cardId;
  const name = req.body.name;
  cardService.addTask(cardId, name)
  .then(cardSaved => {
    res.status(200).json({message: 'Add task successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name updateTaskName
* @description
* Check current user is exist in board
* Do update task name
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function updateTaskName(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task from params
  //Get newName from body
  const index = req.params.index;
  const newName = req.body.name;
  cardService.updateTaskName(newName, index, cardId)
  .then(cardSaved => {
    res.status(200).json({message: 'Update task name successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name deleteTask
* @description
* Check current user is exist in board
* Do delete task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function deleteTask(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task from params
  const index = req.body.index;
  cardService.deleteTask(index, cardId)
  .then(cardSaved => {
    res.status(200).json({message: 'Delete task successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name addContentTask
* @description
* Check current user is exist in board
* Do add a content task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function addContentTask(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task content from params
  const index = req.params.index;
  const content = req.body.content;
  cardService.addContentTask(content, index, cardId)
  .then(cardSaved => {
    res.status(200).json({message: 'Add content task successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({memberId: err.message});
  });
}

/**
* @name updateContentTask
* @description
* Check current user is exist in board
* Do update content of task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function updateContentTask(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task, index of content from params
  //Get newContent from body
  const indexTask = req.params.indexTask;
  const indexContent = req.params.indexContent;
  const newContent = req.body.content;
  cardService.updateContentTask(newContent, indexTask, indexContent, cardId)
  .then(cardSaved => {
    res.status(200).json({message: 'Update content task successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({memberId: err.message});
  });
}

/**
* @name deleteContentTask
* @description
* Check current user is exist in board
* Do delete a content of task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function deleteContentTask(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task, indexContent of content from body
  const indexTask = req.params.indexTask;
  const indexContent = req.params.indexContent;
  cardService.deleteContentTask(indexTask, indexContent, cardId)
  .then(cardSaved => {
    res.status(200).json({message: 'Delete content task successful!', data: cardSaved});
  })
  .catch(err => {
    res.status(err.code).json({memberId: err.message});
  });
}