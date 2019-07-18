const express       = require("express");
const morgan        = require("morgan");
const bodyParser    = require("body-parser");
const dotenv        = require("dotenv");
const connect_db    = require("./configs/db.js");
const api           = require("./routes/index.js");
const app           = express();
dotenv.config();
const PORT = process.env.HOST_PORT || 8000;

connect_db();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/v1", api);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;

