const collectionBoard   = require('../models/board.model.js');
const collectionCard    = require('../models/card.model.js');

module.exports = {
  getBoards,
  getCards
}

/**
 * @name getBoards
 * @description
 * Search boards by name
 * @param {String} query query of user
 */
function getBoards(query) {
  return collectionBoard.find({
    name: {
      $regex: query,
      $options: 'i'
    }
  })
  .select('name')
  .then(boards => {
    if (boards.length) return boards;
  });
}

/**
 * @name search
 * @description
 * Search cards by title or description
 * @param {String} query query of user
 */
function getCards(query) {
  return collectionCard.find({
    $or: [
      {
        title: {$regex: query, $options: 'i'}
      },
      {
        description: {$regex: query, $options: 'i'}
      }
    ]
  })
  .select('title dueDate')
  .then(cards => {
    if (cards.length) return cards;
  });
}
