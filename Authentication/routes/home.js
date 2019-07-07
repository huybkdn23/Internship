const express       = require("express");
const logsign       = require("../controllers/log-sign.js");
const mdwPassport   = require("../models/mdwPassport.js");
const router        = express.Router();

router.get("/", logsign.getList);

router.route("/login")
.get(logsign.logInGet)
.post(logsign.authenticatedLogin);

router.route("/signup")
.get(logsign.signUpGet)
.post(logsign.signUpPost);

router.route("/myprofile")
.get(logsign.isAuthen);

router.route("/myprofile/update/:username")
.get(logsign.updateGet)
.put(logsign.updatePut);

mdwPassport.passportUse;
mdwPassport.passportSerializeUser;
mdwPassport.passportDeserializeUser;
module.exports = router;