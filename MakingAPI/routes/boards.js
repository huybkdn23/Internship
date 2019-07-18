const express         = require("express");
const boardController = require("../controllers/board.controller.js");
const userController  = require("../controllers/user.controller.js");
const router          = express.Router();

router.route("/:username/boards")
.get(userController.isAuthenticated, boardController.getFullBoard)
.post(userController.isAuthenticated, boardController.postBoard);

// router.post("/search", userController.isAuthenticated, boardController.searchNameBoard);

router.route("/b/boards/:nameBoard")
.put(userController.isAuthenticated, boardController.updateNameBoard)
.delete(userController.isAuthenticated, boardController.deleteBoard);


// set /b/:boardId/:name not be identical with /:username/boards
router.route("/b/:boardId/name/:name")
.get(userController.isAuthenticated, boardController.getInBoard)
.post(userController.isAuthenticated, boardController.invite)
.delete(userController.isAuthenticated, boardController.removeUser);


module.exports = router;