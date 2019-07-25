const collectionUser    = require('../models/user.model.js');
const cardService       = require('../services/card.service.js');

module.exports = {
  createCard,
  getFullCards,
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
async function createCard(req, res, next) {
  //Get title from body
  let board = req.board;
  const title = req.body.title;
  try {
    const cardSaved = await cardService.create(board, title);
    res.status(200).json({message: 'Create card successful!', data: cardSaved});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

/**
* @name getFullCards
* @description
* Check current user is exist in board before create card
* Do create a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getFullCards(req, res, next) {
  //Get title from body
  let board = req.board;
  const title = req.body.title;
  const user = req.user;
  const query = req.query.q;
  const page = req.query.page;
  const perPage = req.query.perPage;
  const by = req.query.by;
  const sort = req.query.sort;
  try {
    const cards = await cardService.getFullCards(user, query, page, perPage, by, sort);
    res.status(200).json({message: 'Create card successful!', data: cardSaved});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
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
async function getInCard(req, res, next) {
  const id = req.params.cardId;
  try {
    const card = await cardService.getCard(id);
    res.status(200).json({message: 'Get all information of card!', data: card});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function updateTitDesDueMem(req, res, next) {
  //Get title, description, dueDate, member from body
  const id  = req.params.cardId;
  const title = req.body.title;
  const description = req.body.description;
  const dueDate = req.body.dueDate;
  const memberId = req.body.memberId;
  try {
    const cardSaved = await cardService.updateTitDesDueMem(id, title, description, dueDate, memberId);
    res.status(200).json({message: 'Update successful!', data: cardSaved});
  } catch (err) {
    res.json({message: err.message});
  }
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
async function deleteCard(req, res, next) {
  let board = req.board;
  const cardId  = req.params.cardId;
  try {
    const boardSaved = await cardService.deleteCard(cardId, board);
    res.status(200).json({message: 'Delete card successful!', data: boardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function getFullCommentInCard(req, res, next) {
  const id = req.params.cardId;
  try {
    const comments = await cardService.getComments(id);
    res.status(200).json({message: 'All comments in card!', data: comments});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function addComment(req, res, next) {
  //Get comment from body
  const user = req.user;
  const cardId  = req.params.cardId;
  const comment = req.body.comment;
  try {
    const cardSaved = await cardService.addComment(comment, cardId, user);
    res.status(200).json({message: 'Add comment successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function updateComment(req, res, next) {
  const user = req.user;
  const cardId = req.params.cardId;
  //get index of comment from params
  //get newComment from body
  const index = req.params.index;
  const newComment = req.body.comment;
  try {
    const cardSaved = await cardService.updateComment(newComment, index, cardId, user);
    res.status(200).json({message: 'Update comment successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function deleteComment(req, res, next) {
  const user = req.user;
  const board = req.board;
  const cardId = req.params.cardId;
  //get index of comment from params
  const index = req.params.index;
  try {
    const cardSaved = await cardService.deleteComment(index, cardId, user, board);
    res.status(200).json({message: 'Delete comment successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function getFullTaskInCard(req, res, next) {
  const cardId = req.params.cardId;
  try {
    const tasks = await cardService.getTasks(cardId);
    res.status(200).json({message: 'All tasks of card!', data: tasks});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function addTask(req, res, next) {
  const cardId = req.params.cardId;
  const name = req.body.name;
  try {
    const cardSaved = await cardService.addTask(cardId, name);
    res.status(200).json({message: 'Add task successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function updateTaskName(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task from params
  //Get newName from body
  const index = req.params.index;
  const newName = req.body.name;
  try {
    const cardSaved = await cardService.updateTaskName(newName, index, cardId);
    res.status(200).json({message: 'Update task name successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function deleteTask(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task from params
  const index = req.body.index;
  try {
    const cardSaved = await cardService.deleteTask(index, cardId);
    res.status(200).json({message: 'Delete task successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function addContentTask(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task content from params
  const index = req.params.index;
  const content = req.body.content;
  try {
    const cardSaved = await cardService.addContentTask(content, index, cardId);
    res.status(200).json({message: 'Add content task successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({memberId: err.message});
  }
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
async function updateContentTask(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task, index of content from params
  //Get newContent from body
  const indexTask = req.params.indexTask;
  const indexContent = req.params.indexContent;
  const newContent = req.body.content;
  try {
    const cardSaved = await cardService.updateContentTask(newContent, indexTask, indexContent, cardId);
    res.status(200).json({message: 'Update content task successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({memberId: err.message});
  }
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
async function deleteContentTask(req, res, next) {
  const cardId = req.params.cardId;
  //Get index of task, indexContent of content from body
  const indexTask = req.params.indexTask;
  const indexContent = req.params.indexContent;
  try {
    const cardSaved = await cardService.deleteContentTask(indexTask, indexContent, cardId);
    res.status(200).json({message: 'Delete content task successful!', data: cardSaved});
  } catch (err) {
    res.status(err.code).json({memberId: err.message});
  }
}