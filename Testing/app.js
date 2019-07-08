const express = require("express");
const app     = express();

// app.set("port", process.env.PORT || 8000);
app.get("/", (req,res) => {
  // console.log("\n\nreq.headers " + req.headers["user-agent"] + "\n\n");
  res.type("text");
  res.send(req.headers["user-agent"]);
});

// app.listen(app.get("port"), function() {
//   console.log("Server is running on port" + app.get("port"));
// });
module.exports = app;
