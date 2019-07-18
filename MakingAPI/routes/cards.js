const express         = require("express");
const cardController  = require("../controllers/card.controller.js");
const userController  = require("../controllers/user.controller.js");
const handler         = require("../controllers/handler.controller.js");
const router          = express.Router();

router.route("/b/:boardId/c/newc")
.post(userController.isAuthenticated, cardController.postCard);

router.route("/c/:cardId")
.get(userController.isAuthenticated, cardController.getInCard)
.put(userController.isAuthenticated, cardController.updateTitDesDueMem)
.delete(userController.isAuthenticated, cardController.deleteCard);

router.route("/c/:cardId/cmts")
.get(userController.isAuthenticated, cardController.getFullCommentInCard)
.post(userController.isAuthenticated, cardController.addComment)
.put(userController.isAuthenticated, cardController.updateComment)
.delete(userController.isAuthenticated, cardController.deleteComment);

//Add Task, update taskName, delete task
router.route("/c/:cardId/tsks")
.get(userController.isAuthenticated, cardController.getFullTaskInCard)
.post(userController.isAuthenticated, cardController.addTask)
.put(userController.isAuthenticated, cardController.updateTaskName)
.delete(userController.isAuthenticated, cardController.deleteTask);

//Add, update, delete into content of task
router.route("/c/:cardId/contenttsks")
.get(handler.notFoundPage)
.post(userController.isAuthenticated, cardController.addContentTask)
.put(userController.isAuthenticated, cardController.updateContentTask)
.delete(userController.isAuthenticated, cardController.deleteContentTask);

module.exports = router;