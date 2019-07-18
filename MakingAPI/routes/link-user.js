const express         = require("express");
const userController  = require("../controllers/user.controller.js");
const router  = express.Router();

router.route("/:username")
.get(userController.getUser)
.post(userController.isAuthenticated, userController.updateProfile);

module.exports = router;