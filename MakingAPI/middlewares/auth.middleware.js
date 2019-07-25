const collectionUser  = require('../models/user.model.js');
const collectionBoard  = require('../models/board.model.js');
const jwt             = require('jsonwebtoken');

module.exports = {
  isAuthenticated,
  verifyID,
  isExistInBoard,
  isCreatedBy,
  matchID
}

/**
* @name isAuthenticated
* @description
* Authentication
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function isAuthenticated(req, res, next)  {
  if (!req.headers.authorization ||
    req.headers.authorization.split(' ')[0] !== 'Bearer') {
      res.status(401).json({message: 'User is not authorized!'});
    }
  const token = req.headers.authorization.split(' ')[1];
  try {
    const payload = await jwt.verify(token, process.env.jwtSecret);
    let user = await collectionUser.findById(payload.id)
    .exec();
    if (!user) res.status(401).json({message: 'User is not authorized!'});
    req.user = user;
    next();
  } catch (err) {
    return next(new Error(err.message));
  }
}

/**
* @name verifyID
* @description
* Check username password
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {object}   next Next middleware
*/
function verifyID(req, res, next) {
  const id = req.params.id;
  const user = req.user;
  try {
    user.verifyID(id);
    next();
  } catch (err) {
    return res.status(err.code).json({message: err.message});
  }
}

/**
* @name isExistInBoard
* @description
* Check username password
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {object}   next Next middleware
*/
async function isExistInBoard(req, res, next) {
  let id = req.params.id;
  if (!id) id = req.params.boardId;
  let user = req.user;
  user.hashPassword = undefined;
  let board = await collectionBoard.findById(id)
  .populate('members', '-hashPassword')
  .populate('cards')
  .exec();
  if (!board ) {res.status(404).json({message: 'Not found board!'}); return;}
  if (!board.verifyUser(user)) {
    res.status(403).json({message: 'You are not in this board!'});
    return;
  }
  req.board = board;
  next();
}

/**
* @name isCreatedBy
* @description
* Check username password
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {object}   next Next middleware
*/
function isCreatedBy(req, res, next) {
  const user = req.user;
  const board = req.board;
  //find user in board and check permission of user
  if (!board.isCreatedBy(user)) {
    res.status(403).json({message: 'You\'re not authorized!'});
    return;
  }
  next();
}

/**
* @name matchID
* @description
* Check the user ID matching the the id parameter
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {object}   next Next middleware
*/
function matchID(req, res, next) {
  const user = req.user;
  const id = req.params.id;
  try {
    user.verifyID(id);
    next();
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
}
