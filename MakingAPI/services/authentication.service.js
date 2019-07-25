const collectionUser  = require('../models/user.model.js');
const validator       = require('validator');
const MyError         = require('../errors/myError.js');
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
async function create(email, password) {
  if (!validator.isEmail(email)) {
    throw new MyError(400, 'Email invalidated!');
  }
  if (!password) throw new MyError(400, 'Empty password!');
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  let user = new collectionUser({
    email: email,
    hashPassword: hashPassword,
  });
  try {
    return await user.save();
  } catch (err) {
    throw new MyError(400, err.message);
  }
}

/**
* @name login
* @description
* Check username password
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
async function login(email, password) {
  const user = await collectionUser.findOne({email: email})
  .orFail(new MyError(401, 'User is not exist!'))
  .exec();
  if (user.verifyPassword(password)) {
    const payload = {id: user._id};
    const token = jwt.sign(payload, process.env.jwtSecret, {expiresIn: '1d'});
    console.log(`Token: ${token}`);
    return token;
  }
  else throw new MyError(400, 'Login error');
}