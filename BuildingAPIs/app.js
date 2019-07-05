const express     = require("express");
const apiVersion1 = require("./routes/api1.js");
const apiVersion2 = require("./routes/api2.js");
const app         = express();
app.get("/", (req,res) => {
  res.send("Welcome to my page!");
});
app.get("/random/:min/:max", (req,res) => {
  var min = parseInt(req.params.min);
  var max = parseInt(req.params.max);
  //check whether min and max is a number
  if(isNaN(min) || isNaN(max)) {
    res.status(400).json({error: "It's not a number!"});
    return;
  }
  //random a number from min to max
  var result = Math.round(Math.random()*(max-min)+min);
  res.json({result: result});
});
app.route("/method")
.get((req,res) => {
  res.send("This is GET method");
})
.post((req,res) => {
  res.send("This is POST method");
})
.put((req,res) => {
  res.send("This is PUT method");
})
.delete((req,res) => {
  res.send("This is DELETE method");
});

app.use("/api", apiVersion1);
app.use("/api2", apiVersion2);
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});