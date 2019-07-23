const userService     = require('../services/user.service.js');

module.exports = {
  updateProfile,
  inviteUser,
  removeUser,
  getUser,
  getAllCardOfUser
}

/**
* @name updateProfile
* @description
* Check current user is exist in board
* Do update username, first name, last name or email of user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
function updateProfile(req,res) {
  const user = req.user;
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  //send ID and user to check if that is current user
  userService.update(user, username, firstName, lastName)
  .then(userUpdated => {
    res.status(200).json({message: 'Update successful!', data: userUpdated});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name inviteUser
* @description
* Check current user is exist in board
* Check user invited is exist in board
* Do invite the other user 
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function inviteUser(req, res, next) {
  //Get nameOrMail from body
  let board = req.board;
  let memberId = req.params.memberId;
  userService.invite(memberId, board)
  .then(boardSaved => {
    res.status(200).json({message: 'Invite member successful!', data: boardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  })
}

/**
* @name removeUser
* @description
* Check current user is exist in board
* Check permission of current user before remove the others
* Check user removed is exist in board
* Do remove user in all card and in board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function removeUser(req, res, next) {
  let board = req.board;
  let memberId = req.params.memberId;
  userService.remove(memberId, board)
  .then(boardSaved => {
    res.status(200).json({message: 'Remove successful!', data: boardSaved});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name getUser
* @description
* Do get username first name, last name, email of user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getUser(req, res, next) {
  const id = req.params.id;
  userService.getUser(id)
  .then(user => {
    res.status(200).json({message: 'Get user by id!', data: user});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  })
}

/**
* @name getAllCardOfUser
* @description
* Do get all card of current user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getAllCardOfUser(req, res, next) {
  const id = req.params.id;
  userService.getCardsOf(id)
  .then(cards => {
    res.status(200).json({message: 'Get all card of user', data: cards});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}