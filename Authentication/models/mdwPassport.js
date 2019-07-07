const collectionUser  = require("../models/user.js");
const localStrategy   = require("passport-local").Strategy;
const passport      = require("passport");

module.exports = {
  passportUse: passport.use("local.login", new localStrategy((username, password, done) => {
    collectionUser.findOne({usr: username}).exec((err,data) => {
      if(err) {
        console.error(err);
        return done(err);
      }
      if(!data) return done(null, false);
      if(data.verifyPassword(password)) return done(null, data);
      else return done(null, false);
    });
  })),
  
  passportSerializeUser: passport.serializeUser((user, done) => {
    return done(null, user._id);
  }),
  passportDeserializeUser: passport.deserializeUser((userId, done) => {
    collectionUser.findById(userId, (err,data) => {
      if(err) console.error(err);
      return done(null, userId);
    });
  })
}