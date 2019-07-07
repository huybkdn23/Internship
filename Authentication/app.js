const express       = require("express");
const bodyParser    = require("body-parser");
const mongoose      = require("mongoose");
const passport      = require("passport");
const session       = require("express-session");
const router        = require("./routes/api.js");
const app           = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "MySession",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24*60*60*1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/Authentication",{ useNewUrlParser: true,
                                                              useFindAndModify: false,
                                                              useCreateIndex: true});


app.use("/api", router);
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});