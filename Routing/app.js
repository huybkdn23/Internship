const express = require("express");
const app = express();

app.get("/", (req,res) => {
  res.send("welcome to my page.");
});
app.get("/user", (req,res) => {
  res.send("This is user page.");
});
app.get(/^\/user\/(\d+)-(\d+)$/, (req, res) => {
  var first = parseInt(req.params[0]);
  var last  = parseInt(req.params[1]);
  res.send("My id is " + last);
});
app.get("/search", (req,res) => {
  res.send(req.query);
});
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
