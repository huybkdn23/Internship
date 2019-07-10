const express       = require("express");
const session       = require("express-session");
const bodyParser    = require("body-parser");
const morgan        = require("morgan");
const csurf         = require("csurf");

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.disable("x-powered-by");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(session({
    secret: "Security",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24*60*60*1000
    }
}));
app.use(csurf());

app.get("/", (req,res) => {
    res.render("form", {
        csurfToken: req.csrfToken()
    });
});
app.route("/submit")
.post((req,res) => {

    res.status(200).send("Submit successfully");
});

app.use((err,req,res,next) => {
    if(err.code !== "EBADCSRFTOKEN"){
        next();
        return;
    }
    res.status(403).send("CSURF ERROR");
});
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});