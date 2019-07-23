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
function getFullBoard(req, res, next) {
  const user = req.user;
  boardService.getBoardsOf(user)
  .then(boards => {
    res.status(200).json({data: boards});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  })
}

/**
* @name createBoard
* @description
* Do create a board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function createBoard(req ,res, next) {
  const user = req.user;
  const name = req.body.name;
  boardService.create(user, name)
  .then(board => {
    res.status(200).json({message: 'Create board successful!', data: board});
  })
  .catch(err => {
    res.status(500).json({message: err.message});
  });
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
function getInBoard(req, res, next) {
  const board = req.board;
  // console.log(board);
  
  boardService.getIn(board)
  .then(data => {
    res.status(200).json({message: 'List users and cards!', data: data});
  });
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
function updateNameBoard(req, res, next) {
  const board = req.board;
  const newName = req.body.name;
  boardService.update(board, newName)
  .then(boardSaved => {
    res.status(200).json({data: boardSaved});
  })
  .catch(err => {
    res.status(500).json({message: err.message});
  });
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
function deleteBoard(req, res, next) {
  const board = req.board;
  boardService.deleteBoard(board)
  .then(boardRemoved => {
    res.status(200).json({message: 'Delete board successful!', data: boardRemoved});
  })
  .catch(err => {
    res.status(500).json({message: err.message});
  });
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
function getUsersInBoard(req, res, next) {
  const board = req.board;
  boardService.getUsersIn(board)
  .then(members => {
    res.status(200).json({message: 'All users in board!', data: members});
  });
}