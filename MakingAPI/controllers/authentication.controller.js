const authenService   = require('../services/authentication.service.js');
module.exports = {
  createUser,
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
async function createUser(req,res) {
  try {
    const user = await authenService.create(req.body.email, req.body.password);
    res.status(200).json({data: user});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
}

/**
* @name login
* @description
* Check username password
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const token = await authenService.login(email, password);
    res.status(200).json({message: 'Login successful!', token: token});
  } catch (err) {
    res.status(err.code).json({message: err.message});
  }
}

