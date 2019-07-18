const app = require("../app.js");
const supertest = require("supertest");

describe("Testing app", () => {
  var request = supertest(app);

  it("Testing GET signup", (done) => {
    request
    .get("/v1/signup")
    .expect(200)
    .expect((res) => {
      console.log(res.body.message);
    })
    .end(done);
  });

  it("Testting GET login", (done) => {
    request
    .get("/v1/login")
    .expect(200)
    .expect((res) => {
      console.log(res.body.message);
    })
    .end(done);
  });

  it("Testing POST signup", (done) => {
    let data = {
      username: "user1",
      password: "passuser1"
    }
    request
    .post("/v1/signup")
    .send(data)
    .expect(200)
    .expect((res) => {
      if (!res.body.data) console.log("Sign-up success!");
    })
    .end(done);
  });

  it()

});