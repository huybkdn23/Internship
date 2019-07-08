const app       = require("../app.js");
const supertest = require("supertest");

describe("plain text response", function() {
  var request;
  beforeEach(function() {
    request = supertest(app)
    .get("/")
    .set("User-Agent", "my cool browser")
    .set("Accept", "text/plain");
  });
  it("returns a plain text reponse", function(done) {
    request
    .expect("Content-Type", /text\/plain/)
    .expect(200)
    .end(done);
  });

  it("returns the User Agent", function(done) {
    request
    .expect(function(res) {
      console.log("res.text " + res.text);
      
      if(res.text != "my cool browser") {
        throw new Error("Response does not contain User Agent");
      }
    })
    .end(done);
  });
});