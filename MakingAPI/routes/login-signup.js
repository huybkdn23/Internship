const express         = require("express");
const userController  = require("../controllers/user.controller.js");
const router  = express.Router();

router.route("/login")
.get(userController.logInGet)
.post(userController.logInPost);

router.route("/signup")
.get(userController.signUpGet)
.post(userController.signUpPost);


module.exports = router;