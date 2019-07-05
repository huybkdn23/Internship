const express = require("express");
const api     = express.Router();
api.get("/", (req,res) => {
  res.send("API2: This is version 2");
});
module.exports = api;