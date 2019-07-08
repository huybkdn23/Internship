const User    = require("../models/user.js");
const chai    = require("chai");
const expect  = chai.expect;

describe("User", function() {
  before(function() {
    console.log("This is before() function");
  });
  
  after(function() {
    console.log("This is after() function");
  });
  afterEach(function() {
    console.log("This is afterEach() function");
  });
  var user;
  beforeEach(function() {
    console.log("This is beforeEach() function");
    user = new User({
      firstName: "Ho",
      lastName: "Huy",
      birthday: 1998
    });
  });
  
  it("Check get name", function() {
    expect(user.getName()).to.equal("Ho Huy");
  });

  it("Check get age", function() {
    expect(user.getAge()).to.equal(21);
  });

  it("Check not equal name", function() {
    expect(user.getName()).not.to.equal("Sky Blue");
  });

  it("Check not equal age", function() {
    expect(user.getAge()).not.to.equal(24);
  });
});