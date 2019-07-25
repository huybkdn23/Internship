const collectionBoard   = require('../models/board.model.js');
const collectionCard    = require('../models/card.model.js');
const MyError           = require('../errors/myError.js');
const {DEFAULT_PERPAGE, ASCENDING, DESCENDING} = require('../configs/const.js');

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
async function create(user, name) {
  if (!name) throw new MyError(400, 'Empty name!');
  try {
    const boardSaved = await collectionBoard.create({name: name, 
                                                    members: user, 
                                                    createdBy: user});
    return boardSaved; 
  } catch (err) {
    throw new MyError(400, err.message);
  }
}

function pagination(page, perPage) {
  let options = {};
  page = parseInt(page - 1);
  perPage = parseInt(perPage);
  if (isNaN(perPage) || perPage <= 0) perPage = DEFAULT_PERPAGE;
  options.limit = parseInt(perPage);
  if (!isNaN(page) && page >= 0) {
    options.skip = perPage * page;
  }
  //if page = null
  else options.skip = 0;
  return options;
}

function flexibleSort(sort){
  if (!sort) sort = ASCENDING;
  sort = sort.toLowerCase();
  if (sort !== ASCENDING && sort !== DESCENDING) {
    throw new MyError(422, 'Order by invalid!');
  }
  return sort;
}

function flexibleSearch(query, user) {
  let conditionQuery = {'$and': [{members : user}]};
  if (!query) return conditionQuery;
  conditionQuery['$and'].push({'$text': {'$search' : query}});
  return conditionQuery;
}

/**
* @name getBoardsOf
* @description
*
* @param  {object}   user  Current user
*/
async function getBoardsOf(user, query, page, perPage, sort) {
  const optionsPagination = pagination(page, perPage);
  const optionsSort = flexibleSort(sort);
  const conditionSearch = flexibleSearch(query, user);
  const boards = await collectionBoard.find(conditionSearch)
  .select('name')
  .setOptions(optionsPagination)
  .sort({name : optionsSort})
  .orFail(new MyError(404, 'Not found boards!'))
  .exec();
  return boards;
}

/**
* @name getIn
* @description
*
* @param  {object}   board  Current board
*/
async function getIn(board) {
  return {
    users: board.members,
    cards: board.cards
  }
}

/**
* @name update
* @description
*
* @param  {object}   board  Current board
*/
async function update(board, name) {
  if (!name) throw new MyError(400, 'Empty name!');
  board.name = name;
  const boardSaved = await board.save();
  return boardSaved;
}

/**
* @name deleteBoard
* @description
*
* @param  {object}   board  Board deleted
*/
async function deleteBoard(board) {
  let cards = [];
  board.cards.forEach(card => {
    cards.push(card._id);
  });
  //remove all cards in this board
  await collectionCard.deleteMany({_id: cards})
  .exec();
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
async function getUsersIn(board) {
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
  
  return members;
}
  