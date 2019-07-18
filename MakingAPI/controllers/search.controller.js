const collectionBoard   = require("../models/board.model.js");
const collectionCard    = require("../models/card.model.js");

module.exports = {
  search: function(req, res, next) {
    var query = req.query.q;
    var arrBoards = [];
    var arrCards = [];
    query = query.replace(/%20/g, " ");
    collectionBoard.find({name: query})
    .select("name")
    .exec((err, boards) => {
      if (err) return next(new Error(err.message));
      if (boards.length) arrBoards = boards;
    });
    collectionCard.find({title: query})
    .select("title dueDate")
    .exec((err, cards) => {
      if (err) return next(new Error(err.message));
      if (cards.length) arrCards = cards;
    });
    res.status(200).json({
      success: true, 
      data: {
        arrBoards: arrBoards, 
        arrCards: arrCards
      }
    });
  },

  get: function(req, res) {
    res.status(200).json({success: true, message: "Search page!"});
  }

}