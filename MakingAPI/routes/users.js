const userController    = require('../controllers/user.controller.js');
const auth              = require('../middlewares/auth.middleware.js');
const express           = require('express');
const multer            = require('multer');
const router            = express.Router();
// SET STORAGE
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  //cb function has 2 parameters are err and boolean to indicate if the file should be accepted
  const type = file.mimetype;
  if (type === 'image/jpeg' || type === 'image/png') cb(null, true);
  else cb(null, false);
}

const limit = {
  //Max file size (in bytes)	
  fileSize: 5 * 1024 * 1024 //5MB
}
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limit
})

router.route('/users/:id')
.get(userController.getUser)
.put(auth.isAuthenticated, auth.verifyID, userController.updateProfile);

router.route('/update/avatars/:id')
.put(auth.isAuthenticated, upload.single('path'), userController.updateAvatar)

router.route('/invite/:memberId/:boardId')
.post(auth.isAuthenticated, auth.isExistInBoard, userController.inviteUser);

router.route('/remove/:memberId/:boardId')
.delete(auth.isAuthenticated, auth.isExistInBoard, auth.isCreatedBy, userController.removeUser);

router.route('/members/:id/cards')
.get(auth.isAuthenticated, auth.matchID, userController.getAllCardOfUser);

module.exports = router;