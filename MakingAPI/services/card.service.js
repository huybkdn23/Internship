const collectionCard    = require('../models/card.model.js');

module.exports = {
  create,
  getCard,
  updateTitDesDueMem,
  deleteCard,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getTasks,
  addTask,
  updateTaskName,
  deleteTask,
  addContentTask,
  updateContentTask,
  deleteContentTask
}

/**
* @name create
* @description
* Check current user is exist in board before create card
* Do create a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function create(board, title) {
  let card = new collectionCard({title: title});
  board.cards.push(card);
  board.save();
  return card.save();
}

/**
* @name getCard
* @description
* Check current user is exist in board
* Do get all information in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getCard(id) {
  return collectionCard.findById(id)
  .populate({
    path: 'members',
    select: 'email username'
  })
  .then(card => {
    if (!card) {
      return Promise.reject({code: 404, message: 'Not found card!'});
    }
    return card;
  });
}

/**
* @name updateTitDesDueMem
* @description
* Check current user is exist in board
* Do update a title, description, dueday, member
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function updateTitDesDueMem(id, board, title, description, dueDate, memberId) {
  //Get title, description, dueDate, member from body
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    card.updateTitle(title);
    card.updateDescription(description);
    try {
      card.updateDueDate(dueDate);
    } catch (error) {
      return Promise.reject({code: 400, message: error.message});
    }
    if (memberId && board.verifyId(memberId)) {
      //Check if member is exist in the card, they are removed on card. Else they are pushed on card
      //Member can be added or deleted
      return card.updateMember(memberId);
    }
    return card.save();
  });
}

/**
* @name deleteCard
* @description
* Check current user is exist in board
* Do delete a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function deleteCard(id, board) {
  return collectionCard.findById(id)
  .then(card => {
    try {
      board.removeCards(card);
      card.remove();
      return board.save();
    } catch (error) {
      return Promise.reject({code: 500, message: err.message});
    }
  });
}

/**
* @name getComments
* @description
* Check current user is exist in board
* Do get all comment in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getComments(id) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) {
      return Promise.reject({code: 404, message: 'Not found card!'});
    }
    return card.comments;
  });
}

/**
* @name addComment
* @description
* Check current user is exist in board
* Do add a comment
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function addComment(comment, id, user) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    if (!comment) return Promise.reject({code: 400, message: 'Empty comment!'});
    card.comments.push({
      content: comment,
      commentedBy: user._id
    });
    return card.save();
  });
}

/**
* @name updateComment
* @description
* Check current user is exist in board
* Check who comments?
* Do update a comment
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function updateComment(comment, index, id, user) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    //Check who comments
    if (!card.isCommentedBy(user, index)) {
      return Promise.reject({code: 403, message: 'You\'re not authorized!'});
    }
    card.comments[index].content = comment;
    try {
      return card.save();
    } catch (error) {
      return Promise.reject({code: 500, message: err.message});
    }
  })
}

/**
* @name deleteComment
* @description
* Check current user is exist in board
* Check who comments?
* Do delete comment
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function deleteComment(index, id, user, board) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    //Check who comments
    if (card.isCommentedBy(user, index) || board.isCreatedBy(user)) {
      //remove comment and who comments
      card.comments.splice(index, 1);
      try {
        return card.save();
      } catch (error) {
        return Promise.reject({code: 500, message: err.message});
      }
    }
    return Promise.reject({code: 403, message: 'You\'re not authorized!'});
  })
}

/**
* @name getTasks
* @description
* Check current user is exist in board
* Do get all task in a card
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function getTasks(id) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    return card.tasks;
  });
}

/**
* @name addTask
* @description
* Check if user is exist in board
* Do create a task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function addTask(id, name) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    if (!name) return Promise.reject({code: 400, message: 'Empty task name!'});
    card.tasks.push({taskName: name});
    try {
      return card.save();
    } catch (error) {
      return Promise.reject({code: 500, message: err.message});
    }
  });
}

/**
* @name updateTaskName
* @description
* Check current user is exist in board
* Do update task name
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function updateTaskName(name, index, id) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    if (!name) return Promise.reject({code: 400, message: 'Empty task name!'});
    card.tasks[index].taskName = name;
    try {
      return card.save();
    } catch (error) {
      return Promise.reject({code: 500, message: err.message});
    }
  });
}

/**
* @name deleteTask
* @description
* Check current user is exist in board
* Do delete task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function deleteTask(index, id) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    card.tasks.splice(index, 1);
    try {
      return card.save();
    } catch (error) {
      return Promise.reject({code: 500, message: err.message});
    }
  });
}

/**
* @name addContentTask
* @description
* Check current user is exist in board
* Do add a content task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function addContentTask(content, index, id) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    card.tasks[index].contents.push(content);
    try {
      return card.save();
    } catch (error) {
      return Promise.reject({code: 500, message: err.message});
    }
  });
}

/**
* @name updateContentTask
* @description
* Check current user is exist in board
* Do update content of task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function updateContentTask(content, indexTask, indexContent, id) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    card.tasks[indexTask].contents[indexContent] = content;
    try {
      return card.save();
    } catch (error) {
      return Promise.reject({code: 500, message: err.message});
    }
  });
}

/**
* @name deleteContentTask
* @description
* Check current user is exist in board
* Do delete a content of task
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function deleteContentTask(indexTask, indexContent, id) {
  return collectionCard.findById(id)
  .then(card => {
    if (!card) return Promise.reject({code: 404, message: 'Not found card!'});
    card.tasks[indexTask].contents.splice(indexContent, 1);
    try {
      return card.save();
    } catch (error) {
      return Promise.reject({code: 500, message: err.message});
    }
  });
}