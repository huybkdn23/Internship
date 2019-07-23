const express           = require('express');
const boardController   = require('../controllers/board.controller.js');
const auth              = require('../middlewares/auth.middleware.js');
const router            = express.Router();

//Add a board and get board
router.route('/boards')
.get(auth.isAuthenticated, boardController.getFullBoard)
.post(auth.isAuthenticated, boardController.createBoard);

//Get in board, delete a board or update board name
router.route('/boards/:id')
.get(auth.isAuthenticated, auth.isExistInBoard, boardController.getInBoard)
.put(auth.isAuthenticated, auth.isExistInBoard, auth.isCreatedBy, boardController.updateNameBoard)
.delete(auth.isAuthenticated, auth.isExistInBoard, auth.isCreatedBy, boardController.deleteBoard);

//Get all user in board
router.route('/boards/:id/members')
.get(auth.isAuthenticated, auth.isExistInBoard, boardController.getUsersInBoard)
module.exports = router;