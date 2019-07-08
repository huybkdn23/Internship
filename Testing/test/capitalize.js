var capitalize  = require("../capitalize.js");
var chai        = require("chai");
var expect      = chai.expect;

describe("capitalize", function() {
  it("capitalizes single words", function() {
    expect(capitalize("express")).to.equal("Express");
    expect(capitalize("javAsCript")).to.equal("Javascript");
  });

  it("Check the rest of string lowercase", function() {
    expect(capitalize("nodeJs")).to.equal("Nodejs");
  });

  it("Check empty string", function() {
    expect(capitalize("")).to.equal("");
  });

  it("leaves strings with no words alone", function() {
    expect(capitalize(" ")).to.equal(" ");
    expect(capitalize("123")).to.equal("123");
  });

  it("capitalizes multiple-word strings", function() {
    expect(capitalize("what is Express?")).to.equal("What is express?");
    expect(capitalize("i love lamp")).to.equal("I love lamp");
  });

  it("leaves already-capitalized words alone", function() {
    expect(capitalize("Express")).to.equal("Express");
    expect(capitalize("Evan")).to.equal("Evan");
    expect(capitalize("Catman")).to.equal("Catman");
  });

  it("capitalizes string object", function() {
    var obj = new String("i am superman");
    expect(capitalize(obj.valueOf())).to.equal("I am superman");
    expect(capitalize(obj)).to.equal("I am superman");
  })
});