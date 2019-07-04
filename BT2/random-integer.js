const MAX = 100;
var randomInteger = function() {
  return Math.floor(Math.random() * MAX)
};
//khi export rieng le khong phai la object thi no se truyen di module cuoi cung dc khai bao
//gia tri duoc export co the la mot function, mot object, string, number, ...
module.exports = randomInteger;
