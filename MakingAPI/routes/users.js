const userController  = require("../controllers/user.controller.js");
const boardController = require("../controllers/board.controller.js");
const express         = require("express");
const router          = express.Router();

//handler for board
router.route("/:name/members")
.get(userController.isAuthenticated, userController.getUsersInBoard)
.post(userController.isAuthenticated, boardController.invite)
.delete(userController.isAuthenticated, boardController.removeUser);

router.route("/iduser/:idUser/cards")
.get(userController.isAuthenticated, userController.getAllCardOfUser);

module.exports = router;