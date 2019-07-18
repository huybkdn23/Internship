const mongoose  = require("mongoose");
module.exports = () => {
  const HOST      = process.env.HOST;
  const DB_PORT   = process.env.DB_PORT;
  const DB_NAME   = process.env.DB_NAME;
  mongoose.connect(`mongodb://${HOST}:${DB_PORT}/${DB_NAME}`,
   {useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true},
  function(err) {
    if (err) throw err;
    console.log("Connect DB successful!");
  });
}