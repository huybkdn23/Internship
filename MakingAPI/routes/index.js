const express         = require('express');
const authentication  = require('./authentication');
const board           = require('./boards.js');
const card            = require('./cards.js');
const search          = require('./search.js');
const user            = require('./users.js');
const handler         = require('../middlewares/handler.middleware.js');

const router  = express.Router();

router.use('/', search);
router.use('/', authentication);
router.use('/', board);
router.use('/', user);
router.use('/', card);

router.use(handler.notFoundPage);
router.use(handler.catchError);

module.exports = router;