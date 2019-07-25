const boardService      = require('../services/board.service.js');

module.exports = {
  getFullBoard,
  createBoard,
  getInBoard,
  updateNameBoard,
  deleteBoard,
  getUsersInBoard
}
/**
* @name getFullBoard
* @description
* Do get all board of current user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getFullBoard(req, res, next) {
  const user = req.user;
  const query = req.query.q;
  const page = req.query.page;
  const perPage = req.query.perPage;
  const sort = req.query.sort;
  try {
    const boards = await boardService.getBoardsOf(user, query, page, perPage, sort);
    res.status(200).json({data: boards});
  } catch (err) {
    res.json({message: err.message});
  }
}

/**
* @name createBoard
* @description
* Do create a board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function createBoard(req ,res, next) {
  const user = req.user;
  const name = req.body.name;
  try {
    const board = await boardService.create(user, name);
    res.status(200).json({message: 'Create board successful!', data: board});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
}

/**
* @name getInBoard
* @description
* Check current user is exist in board
* Do get all users and cards in board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getInBoard(req, res, next) {
  const board = req.board;
  const data = await boardService.getIn(board);
  res.status(200).json({message: 'List users and cards!', data: data});
}

/**
* @name updateNameBoard
* @description
* Do update name of board
* Check perrmission of current user before update name board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function updateNameBoard(req, res, next) {
  const board = req.board;
  const newName = req.body.name;
  try {
    const boardSaved = await boardService.update(board, newName);
    res.status(200).json({data: boardSaved});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

/**
* @name deleteBoard
* @description
* Check permission of current user before delete board
* Remove all cards in board
* Do delete a board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function deleteBoard(req, res, next) {
  const board = req.board;
  try {
    const boardRemoved = await boardService.deleteBoard(board);
    res.status(200).json({message: 'Delete board successful!', data: boardRemoved});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

/**
* @name getUsersInBoard
* @description
* Check current user is exist in board
* Do get user in board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getUsersInBoard(req, res, next) {
  const board = req.board;
  const members = await boardService.getUsersIn(board);
  res.status(200).json({message: 'All users in board!', data: members});
}