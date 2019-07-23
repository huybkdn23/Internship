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
function isAuthenticated(req, res, next)  {
  if (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.jwtSecret, (err, payload) => {
          if (err) return next(new Error(err.message));
          collectionUser.findById(payload.id)
          .exec((err, user) => {
            if (err) throw err;
            if (user) {req.user = user; next();}
            else res.status(401).json({success: false, message: 'User is not authorized!'});
          });
        });
      }
  else {
    res.status(401).json({success: false, message: 'User is not authorized!'});
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
  if (!user.verifyID(id)) {
    return res.status(403).json({message: 'User is not authorized!'});
  }
  else next();
}

/**
* @name isExistInBoard
* @description
* Check username password
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {object}   next Next middleware
*/
function isExistInBoard(req, res, next) {
  let id = req.params.id;
  if (!id) id = req.params.boardId;
  let user = req.user;
  user.hashPassword = undefined;
  collectionBoard.findById(id)
  .populate('members', '-hashPassword')
  .populate('cards')
  .exec((err, board) => {
    if (!board ) res.status(404).json({message: 'Not found board!'});
    if (!board.verifyUser(user)) {
      res.status(403).json({message: 'You are not in this board!'});
      return;
    }
    else {
      req.board = board;
      next();
    }
  })
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
  if (user.verifyID(id)) {
    next();
    return;
  }
  res.status(403).json({message: 'You\'re not authorized!'});
}
