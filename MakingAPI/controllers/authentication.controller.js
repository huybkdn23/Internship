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
function createUser(req,res) {
  authenService.create(req.body.email, req.body.password)
  .then(user => {
    res.status(200).json({data: user});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  });
}

/**
* @name login
* @description
* Check username password
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  authenService.login(email, password)
  .then(token => {
    res.status(200).json({message: 'Login successful!', token: token});
  })
  .catch(err => {
    res.status(err.code).json({message: err.message});
  })
}

