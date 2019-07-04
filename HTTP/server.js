const http      = require("http");
const file      = require("fs");

file.readFile("./text.txt", {encoding: "utf8"}, (err, data) => {
    console.log("Phuong thuc doc file bat dong bo: " + data);
});
var readFile = file.readFileSync("./text.txt", {encoding:"utf8"});
console.log("Phuong thuc doc file dong bo: " + readFile);
var server = http.createServer((req,res) => {
    //Tham so request la yeu cau client gui len sever
    //Tham so response la phan hoi tu phia sever
    //Ham writeHead() thiet lap kieu du lieu ma sever muon tra ve (tra ve trang html)
    res.writeHead(200,"Request duoc xu ly thanh cong!",{"Content-Type": "text/plain"});
    //Hàm này thiết lập nội dung mà server muốn trả về trình duyệt, nội dung này có thể là text có thể là HTML code.
    res.write(readFile);
    var date = new Date();
    if(req.url === "/") {
        console.log(req.method + "/" + res.statusCode + "/" + date.getMilliseconds()  + req.url);
        res.end("\nThis is Homepage!");
    }
    else if(req.url === "/about") {
        console.log(req.method + "/" + res.statusCode + "/" + date.getMilliseconds()  + req.url);
        res.end("\nThis is Aboutpage!");
    }
    else {
        console.log(req.method + "/" + res.statusCode + "/" + date.getMilliseconds()  + req.url);
        res.end("Not found page!");
    }
});
server.listen(8000, () => {
    console.log("Server is running on port 8000");
});