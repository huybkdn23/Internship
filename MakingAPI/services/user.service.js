const collectionUser  = require('../models/user.model.js');
const collectionBoard = require('../models/board.model.js');
const collectionCard  = require('../models/card.model.js');
const MyError         = require('../errors/myError.js');

module.exports = {
  getUser,
  update,
  invite,
  remove,
  getCardsOf,
  updateAvatar
}

/**
* @name getUser
* @description
* Do get username first name, last name, email of user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getUser(id) {
  const user = await collectionUser.findById(id)
  .select('username firstName lastName email -_id')
  .orFail(new MyError(404, 'Not found User!'))
  .exec();
  return user;
}

/**
* @name updateProfile
* @description
* Check current user is exist in board
* Do update username, first name, last name or email of user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
async function update(id, username, firstName, lastName, birthDay, path) {
  if (!username && !firstName && !lastName && !birthDay && !path) {
    throw new MyError(400, 'Empty field!');
  }
  try {
    //validate before update
    //return update value 
    let user = await collectionUser.findById(id)
    .orFail(new MyError(404, 'Not found user!'))
    .exec();
    user.updateUsername(username);
    user.updateFirstName(firstName);
    user.updateLastName(lastName);
    user.updateBirth(birthDay);
    return await user.save();
  } catch (error) {
    throw new MyError(error.code, error.message);
  }
}

/**
* @name invite
* @description
* Check current user is exist in board
* Check user invited is exist in board
* Do invite the other user 
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function invite(id, board) {
  const user = await collectionUser.findById(id)
  .select('-hashPassword')
  .orFail(new MyError(404, 'Not found user!'))
  .exec();
  if (board.verifyUser(user)) {
    throw new MyError(400, 'User invited is exist in board');
  }
  board.members.push(user);
  return await board.save();
}

/**
* @name remove
* @description
* Check current user is exist in board
* Check permission of current user before remove the others
* Check user removed is exist in board
* Do remove user in all card and in board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function remove(id, board) {
  const user = await collectionUser.findById(id)
  .select('-hashPassword')
  .orFail(new MyError(404, 'Not found user!'))
  .exec();
  if (!board.verifyUser(user)) {
    throw new MyError(400, 'User removed is not exist in board');
  }
  //remove user in card (member and comment)
  board.cards.forEach(card => {
    card.removeUser(user);
  });
  //remove user in board
  let indexOfUser = board.getIndexOf(user);
  board.members.splice(indexOfUser, 1);
  return await board.save();
}

/**
* @name getCardsOf
* @description
* Do get all card of current user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
async function getCardsOf(id) {
  const cards = await collectionCard.find({members: id})
  .orFail(new MyError(404, 'Not found card!'))
  .exec();
  return cards;
}

/**
* @name updateAvatar
* @description
* Do get all card of current user
* @param  {Object}   user  Current user
* @param  {String}   path  Path image
*/
async function updateAvatar(user, path) {
  if (path === '') throw new MyError(400, 'Invalid image!');
  user.path = path;
  return await user.save();
}