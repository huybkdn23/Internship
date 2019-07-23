const searchService     = require('../services/search.service.js');

module.exports = {
  search
}

/**
 * @name search
 * @description
 * Search boards or cards
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 */
function search(req, res) {
  const query = req.query.q;
  Promise.all([
    searchService.getBoards(query),
    searchService.getCards(query)
  ])
  .then(results => {
    res.status(200).json({
      message: 'Boards and cards are found!', 
      data: {
        boards: results[0],
        cards: results[1]
      }
    });
  })
  .catch(err => {
    res.json({message: err.message});
  })
}
