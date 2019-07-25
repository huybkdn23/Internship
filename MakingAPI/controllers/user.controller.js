const userService     = require('../services/user.service.js');

module.exports = {
  updateProfile,
  inviteUser,
  removeUser,
  getUser,
  getAllCardOfUser,
  updateAvatar
}

/**
* @name updateProfile
* @description
* Check current user is exist in board
* Do update username, first name, last name or email of user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
async function updateProfile(req, res) {
  const user = req.user;
  const id = req.params.id;
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthDay = req.body.birthDay;
  try {
    //Check if that is current user
    user.verifyID(id);
    const userUpdated = await userService.update(id, username, firstName, lastName, birthDay);
    res.status(200).json({message: 'Update successful!', data: userUpdated});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function inviteUser(req, res, next) {
  //Get nameOrMail from body
  let board = req.board;
  let memberId = req.params.memberId;
  try {
    const boardSaved = await userService.invite(memberId, board);
    res.status(200).json({message: 'Invite member successful!', data: boardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
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
async function removeUser(req, res, next) {
  let board = req.board;
  let memberId = req.params.memberId;
  try {
    const boardSaved = await userService.remove(memberId, board);
    res.status(200).json({message: 'Remove successful!', data: boardSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
}

/**
* @name getUser
* @description
* Do get username first name, last name, email of user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getUser(req, res, next) {
  const id = req.params.id;
  try {
    const user = await userService.getUser(id);
    res.status(200).json({message: 'Get user by id!', data: user});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
}

/**
* @name getAllCardOfUser
* @description
* Do get all card of current user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getAllCardOfUser(req, res, next) {
  const id = req.params.id;
  try {
    const cards = await userService.getCardsOf(id);
    res.status(200).json({message: 'Get all card of user', data: cards});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
}
async function updateAvatar(req, res) {
  try {
    let user = req.user;
    const path = req.file.path;
    const id = req.params.id;
    user.verifyID(id);
    const userSaved = await userService.updateAvatar(user, path);
    res.status(200).json({message: 'Update avatar successful!', data: userSaved});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
}