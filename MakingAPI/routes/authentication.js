const express           = require('express');
const authenController  = require('../controllers/authentication.controller.js');
const router            = express.Router();

router.route('/login')
.post(authenController.login);

router.route('/signup')
.post(authenController.createUser);


module.exports = router;