const express   = require("express");
const home    = require("./home.js");
const api       = express.Router();
api.use("/home", home);
api.use((err,req,res,next) => {
  //Error can come here, catch it
});
api.use((req,res) => {
  res.status(404).send("Page not found! ERROR 404!");
});
module.exports = api;