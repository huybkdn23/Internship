module.exports = {
  catchError: function(err, req, res, next) {
    res.json({
      success: false,
      message: err.message
    });
  },

  notFoundPage: function(req, res) {
    res.status(404).json({success: false, message: "Not found page!"});
  }
}