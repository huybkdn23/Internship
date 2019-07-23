const collectionUser  = require('../models/user.model.js');
const validator       = require('validator');
const bcrypt          = require('bcrypt');
const jwt             = require('jsonwebtoken');
module.exports = {
  create,
  login
}
/**
* @name createUser
* @description
* Do create a new user
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function create(email, password) {
  return new Promise(function(resolve, reject) {
    if (!validator.isEmail(email)) {
      return reject({code: 400, message: 'Email invalidated!'});
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject({code: 500, message: err.message});
      bcrypt.hash(password, salt, (err, hashPassword) => {
        if (err) return reject({code: 500, message: err.message});
        let user = new collectionUser({
          email: email,
          hashPassword: hashPassword,
        });
        user.save((err, userSaved) => {
          if (err) return reject({code: 400, message: err.message});
          resolve(userSaved);
        });
      });
    });
  });
}

/**
* @name login
* @description
* Check username password
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
function login(email, password) {
  return new Promise(function(resolve, reject) {
    collectionUser.findOne({email: email})
    .exec((err, user) => {
      if (err) reject({code: 500, message: err.message});
      if (!user) reject({code: 401, message: 'User is not exist!'});
      else if (user.verifyPassword(password)) {
        const payload = {id: user._id};
        const token = jwt.sign(payload, process.env.jwtSecret, {expiresIn: '1d'});
        console.log(`Token: ${token}`);
        resolve(token);
      }
      else reject({code: 400, message: 'Login error'});
    });
  });
}