const express           = require("express");
const searchController  = require("../controllers/search.controller.js");
const userController  = require("../controllers/user.controller.js");
const router            = express.Router();

router.route("/search")
.get(userController.isAuthenticated, searchController.get)
.post(userController.isAuthenticated, searchController.search);

module.exports = router;