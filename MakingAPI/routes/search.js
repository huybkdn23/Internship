const express           = require('express');
const searchController  = require('../controllers/search.controller.js');
const auth              = require('../middlewares/auth.middleware.js');
const router            = express.Router();

router.route('/search')
.post(auth.isAuthenticated, searchController.search);

module.exports = router;