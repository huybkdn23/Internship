const express = require("express");
const api     = express.Router();
api.get("/", (req,res) => {
  res.send("This is version 1");
});
module.exports = api;