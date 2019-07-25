const collectionCard    = require('../models/card.model.js');
const collectionBoard   = require('../models/board.model.js');
const MyError           = require('../errors/myError.js');
module.exports = {
  create,
  getCard,
  updateTitDesDueMem,
  deleteCard,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getTasks,
  addTask,
  updateTaskName,
  deleteTask,
  addContentTask,
  updateContentTask,
  deleteContentTask
}

/**
* @name create
* @description
* Check current user is exist in board before create card
* Do create a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function create(board, title) {
  if (!title) throw new MyError(400, 'Empty title!');
  let card = new collectionCard({title: title});
  board.cards.push(card);
  board.save();
  return await card.save();
}

/**
* @name getCard
* @description
* Check current user is exist in board
* Do get all information in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getCard(id) {
  const card = await collectionCard.findById(id)
  .populate({
    path: 'members',
    select: 'email username'
  })
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  return card;
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
async function updateTitDesDueMem(id, title, description, dueDate, memberId) {
  const board = await collectionBoard.findOne({cards: id})
  .exec();
  //Get title, description, dueDate, member from body
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  card.updateTitle(title);
  card.updateDescription(description);
  try {
    card.updateDueDate(dueDate);
  } catch (error) {
    throw new MyError(error.code, error.message);
  }
  if (memberId) {
    if (!board.verifyId(memberId)) throw new MyError(404, 'Invalid member!');
    //Check if member is exist in the card, they are removed on card. Else they are pushed on card
    //Member can be added or deleted
    return await card.updateMember(memberId);
  }
  return await card.save();
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
async function deleteCard(id, board) {
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  board.removeCards(card);
  return await card.remove();
}

/**
* @name getComments
* @description
* Check current user is exist in board
* Do get all comment in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getComments(id) {
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  return card.comments;
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
async function addComment(comment, id, user) {
  if (!comment) throw new MyError(400, 'Empty comment!');
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  card.comments.push({
    content: comment,
    commentedBy: user._id
  });
  return await card.save();
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
async function updateComment(comment, index, id, user) {
  if (!comment) throw new MyError(400, 'Empty comment!');
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  //Check who comments
  if (!card.isCommentedBy(user, index)) {
    throw new MyError(403, 'You\'re not authorized!');
  }
  card.comments[index].content = comment;
  return await card.save();
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
async function deleteComment(index, id, user, board) {
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  //Check who comments
  if (card.isCommentedBy(user, index) || board.isCreatedBy(user)) {
    //remove comment and who comments
    card.comments.splice(index, 1);
    return await card.save();
  }
  throw new MyError(403, 'You\'re not authorized!');
}

/**
* @name getTasks
* @description
* Check current user is exist in board
* Do get all task in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getTasks(id) {
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  return card.tasks;
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
async function addTask(id, name) {
  if (!name) throw new MyError(400, 'Empty task name!');
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  card.tasks.push({taskName: name});
  return await card.save();
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
async function updateTaskName(name, index, id) {
  if (!name) throw new MyError(400, 'Empty task name!');
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  card.tasks[index].taskName = name;
  return await card.save();
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
async function deleteTask(index, id) {
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  card.tasks.splice(index, 1);
  return await card.save();
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
async function addContentTask(content, index, id) {
  if (!content) throw new MyError(400, 'Empty content!');
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  card.tasks[index].contents.push(content);
  return await card.save();
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
async function updateContentTask(content, indexTask, indexContent, id) {
  if (!content) throw new MyError(400, 'Empty content!');
  let card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  card.markModified('tasks');
  card.tasks[indexTask].contents[indexContent] = content;
  return await card.save();
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
async function deleteContentTask(indexTask, indexContent, id) {
  const card = await collectionCard.findById(id)
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  card.tasks[indexTask].contents.splice(indexContent, 1);
  return await card.save();
}