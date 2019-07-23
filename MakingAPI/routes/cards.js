const express           = require('express');
const cardController    = require('../controllers/card.controller.js');
const auth              = require('../middlewares/auth.middleware.js');
const router            = express.Router();

router.route('/boards/:id/cards')
.post(auth.isAuthenticated, auth.isExistInBoard, cardController.createCard);

router.route('/boards/:boardId/cards/:cardId')
.get(auth.isAuthenticated, auth.isExistInBoard, cardController.getInCard)
.put(auth.isAuthenticated, auth.isExistInBoard, cardController.updateTitDesDueMem)
.delete(auth.isAuthenticated, auth.isExistInBoard, cardController.deleteCard);

router.route('/boards/:boardId/cards/:cardId/comments')
.get(auth.isAuthenticated, auth.isExistInBoard, cardController.getFullCommentInCard)
.post(auth.isAuthenticated, auth.isExistInBoard, cardController.addComment);

router.route('/boards/:boardId/cards/:cardId/comments/:index')
.put(auth.isAuthenticated, auth.isExistInBoard, cardController.updateComment)
.delete(auth.isAuthenticated, auth.isExistInBoard, cardController.deleteComment);

//Add Task, update taskName, delete task
router.route('/boards/:boardId/cards/:cardId/tasks')
.get(auth.isAuthenticated, auth.isExistInBoard, cardController.getFullTaskInCard)
.post(auth.isAuthenticated, auth.isExistInBoard, cardController.addTask);

router.route('/boards/:boardId/cards/:cardId/tasks/:index')
.put(auth.isAuthenticated, auth.isExistInBoard, cardController.updateTaskName)
.delete(auth.isAuthenticated, auth.isExistInBoard, cardController.deleteTask);

//Add, update, delete into content of task
router.route('/boards/:boardId/cards/:cardId/tasks/:index/contents')
.post(auth.isAuthenticated, auth.isExistInBoard, cardController.addContentTask);

router.route('/boards/:boardId/cards/:cardId/tasks/:indexTask/contents/:indexContent')
.put(auth.isAuthenticated, auth.isExistInBoard, cardController.updateContentTask)
.delete(auth.isAuthenticated, auth.isExistInBoard, cardController.deleteContentTask);

module.exports = router;