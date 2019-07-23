const collectionUser  = require('../models/user.model.js');
const collectionBoard = require('../models/board.model.js');
const collectionCard  = require('../models/card.model.js');

module.exports = {
  getUser,
  update,
  invite,
  remove,
  getCardsOf
}

/**
* @name getUser
* @description
* Do get username first name, last name, email of user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getUser(id) {
  return new Promise (function(resolve, reject) {
    collectionUser.findById(id)
    .select('username firstName lastName email -_id')
    .exec((err, user) => {
      if (err) return Promise.reject({code: 404, message: err.message});
      if (user) return resolve(user);
      else reject({code: 404, message: 'Not found User!'});
    });
  });
}

/**
* @name updateProfile
* @description
* Check current user is exist in board
* Do update username, first name, last name or email of user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
function update(user, username, firstName, lastName) {
  return collectionUser.findByIdAndUpdate(user._id,
                                          {firstName: firstName, 
                                            lastName: lastName, 
                                            username: username},
                                          {new: true,                   //return update value 
                                            runValidators: true})       //validate before update
  .then(userUpdated => {
    if (!userUpdated) return Promise.reject({code: 404, message: 'Not found user!'});
    return userUpdated;
  });
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
function invite(id, board) {
  return collectionUser.findById(id)
  .select('-hashPassword')
  .then(user => {
    if (!user) return Promise.reject({code: 404, message: 'Not found user!'});
    if (board.verifyUser(user)) {
      return Promise.reject({code: 400, message: 'User invited is exist in board'});
    }
    board.members.push(user);
    return board.save();
  });
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
function remove(id, board) {
  return collectionUser.findById(id)
  .select('-hashPassword')
  .then(user => {
    if (!user) return Promise.reject({code: 404, message: 'Not found user!'});
    if (!board.verifyUser(user)) {
      return Promise.reject({code: 403, message: 'User removed is exist in board'});
    }
    //remove user in card (member and comment)
    board.cards.forEach(card => {
      card.removeUser(user);
    });
    //remove user in board
    let indexOfUser = board.getIndexOf(user);
    board.members.splice(indexOfUser, 1);
    return board.save();
  });
}

/**
* @name getCardsOf
* @description
* Do get all card of current user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getCardsOf(id) {
  return collectionCard.find({members: id})
  .then(cards => {
    if (!cards) {
      return Promise.reject({code: 404, message: 'Not found card!'});
    }
    return cards;
  });
}