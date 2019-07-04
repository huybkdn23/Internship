const express = require("express");
const fs      = require("fs");
const path    = require("path");

const app = express();
app.use(express.static(__dirname + "static"));


app.use((req,res,next) => {
  console.log("Request IP: " + req.url);
  console.log("Request date", new Date());
  next();
});
app.use((req,res, next) => {
  var pathFile = path.join(__dirname, "static", req.url+".txt");
  console.log(pathFile);
  
  //Get information about file
  fs.stat(pathFile, (err, stats) => {
    if(err) {
      // console.error(err);
      next(new Error("Get information error."));
      return;
    }
    console.log("Lay thong tin thanh cong");
    console.log(stats);
    //isFile() method will check whether this is a file
    if(stats.isFile()) {
      res.sendFile(pathFile);
    }
    else next();
  });
});
app.use((err,req,res,next) => {
  res.status(404).send("File not found.");
})
app.get("/", (req,res) => {
  res.send("Welcome to my page!");
});
app.listen(8000,()=>{
  console.log("Server is running on port 8000");
});