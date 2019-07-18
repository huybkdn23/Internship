const express         = require("express");
const login_signup    = require("./login-signup");
const board           = require("./boards.js");
const card            = require("./cards.js");
const search          = require("./search.js");
const user            = require("./users.js");
const linkUser        = require("./link-user.js");
const handler         = require("../controllers/handler.controller.js");

const router  = express.Router();

router.use("/", search);
router.use("/", login_signup);
router.use("/", linkUser);
router.use("/", board);
router.use("/", user);
router.use("/", card);

router.use(handler.notFoundPage);
router.use(handler.catchError);
module.exports = router;