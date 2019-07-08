module.exports = (str) => {
  var x = new String("aklshd");
  var firstLetter = str.charAt(0).toUpperCase();
  var rest        = str.slice(1).toLowerCase();
  return firstLetter + rest;
}