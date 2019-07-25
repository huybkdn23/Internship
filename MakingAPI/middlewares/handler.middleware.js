module.exports = {
  notFoundPage,
  catchError
}

function notFoundPage(req, res) {
  res.status(500).json({message: 'Error!'});
}

/**
* @name catchError
* @description
* 
* @param  {object}   err  HTTP err response
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {Function} next Next middleware
*/
function catchError(err, req, res, next) {
  res.status(500).json({message: err.message});
}