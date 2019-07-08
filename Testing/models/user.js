module.exports = function User(obj){
  this.firstName = obj.firstName || "Blue";
  this.lastName = obj.lastName || "Sky";
  this.birthday = obj.birthday || "21";

  this.getName = function (){
    return this.firstName + ' ' + this.lastName;
  }
  this.getAge = function() {
    var date = new Date();
    return date.getFullYear() - this.birthday;
  }
}