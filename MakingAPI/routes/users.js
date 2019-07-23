const userController    = require('../controllers/user.controller.js');
const auth              = require('../middlewares/auth.middleware.js');
const express           = require('express');
const router            = express.Router();

router.route('/users/:id')
.get(userController.getUser)
.put(auth.isAuthenticated, auth.verifyID, userController.updateProfile);

router.route('/invite/:memberId/:boardId')
.post(auth.isAuthenticated, auth.isExistInBoard, userController.inviteUser);

router.route('/remove/:memberId/:boardId')
.delete(auth.isAuthenticated, auth.isExistInBoard, auth.isCreatedBy, userController.removeUser);

router.route('/members/:id/cards')
.get(auth.isAuthenticated, auth.matchID, userController.getAllCardOfUser);

module.exports = router;