const collectionBoard   = require('../models/board.model.js');
const collectionUser    = require('../models/user.model.js');
const collectionCard    = require('../models/card.model.js');
const userService       = require('./user.service.js');
const mongoose          = require('mongoose');

module.exports = {
  create,
  getBoardsOf,
  getIn,
  update,
  deleteBoard,
  getUsersIn
}

/**
* @name create
* @description
* 
* @param  {object}   user  Current user
* @param  {String}   name  Name of board
*/
function create(user, name) {
  return collectionBoard.create({name: name, 
                          members: user, 
                          createdBy: user})
  .then(boardSaved => {
    return boardSaved;
  });
}

/**
* @name getBoardsOf
* @description
*
* @param  {object}   user  Current user
*/
function getBoardsOf(user) {
  return collectionBoard.find({members: user})
  .select('name')
  .then(boards => {
    if (!boards) return Promise.reject({code: 404, message: 'Not found boards!'});
    return boards;
  })
}

/**
* @name getIn
* @description
*
* @param  {object}   board  Current board
*/
function getIn(board) {
  return Promise.resolve({
      users: board.members,
      cards: board.cards
    });
}

/**
* @name update
* @description
*
* @param  {object}   board  Current board
*/
function update(board, name) {
  board.name = name;
  return board.save();
}

/**
* @name deleteBoard
* @description
*
* @param  {object}   board  Board deleted
*/
function deleteBoard(board) {
  let cards = [];
  board.cards.forEach(card => {
    cards.push(card._id);
  });
  //remove all cards in this board
  collectionCard.deleteMany({_id: cards}).exec((err) => {});
  return board.remove();
}

/**
* @name getUsersIn
* @description
* Check current user is exist in board
* Do get all users in board
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getUsersIn(board) {
  let members = []
  board.members.forEach(member => {
    let obj = {
      firstName: member.firstName,
      lastName: member.lastName,
      birthDay: member.birthDay,
      _id: member._id,
      email: member.email,
      permission: false
    }
    if (member._id.toString() === board.createdBy.toString()) {
      obj.permission = true;
      members.push(obj);
    }
    else members.push(obj);
  });
  
  return Promise.resolve(members);
}
  