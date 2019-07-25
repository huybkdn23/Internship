module.exports = class MyError extends Error {
  constructor(code, message){
    super(message);
    this.code = code;
  }
}
