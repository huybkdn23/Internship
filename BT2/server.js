const express   = require("express");
const http      = require("http");
const morgan    = require("morgan");
var randomInt   = require("./random-integer.js");
const app = express();
//Bao cho Express biet file view nam trong thu muc views va file co duoi la .ejs
app.set("views", "views");
app.set("view engine", "ejs");
app.use(morgan("dev"));
//middleware random so chan thi vao home so le thi khong cho vao
app.use((req,res,next) => {
  var ran = randomInt()
  if(ran % 2 == 0) {console.log(ran); next();}
  else res.status(403).send("Not authorized");
});
//Tao server
app.get("/", (req,res) => {
  res.render("home");
});
app.get("/:id", (req,res) => {
  res.send("Your id is " + req.params.id);
});
// app.listen(8000);
http.createServer(app).listen(8000);