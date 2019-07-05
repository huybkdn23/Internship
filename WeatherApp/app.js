const express   = require("express");
//Forecastio is used for grabbing weather data from API forecast.io
const forecastio   = require("forecastio");
//Zippity-do-dah is used to convert ZIP code into longitude, latitude, state, city, ... 
const zipdb     = require("zippity-do-dah");

const app = express();
var weather = new forecastio("85139a1017dcd78f1e29f34247af76a3");
app.get("/", (req,res) => {
    res.send("Welcome to my weather app.");
});
//ZIP CODE cua cac tinh thanh trong viet nam la 6 so
app.get(/^\/(\d{5})$/, (req,res,next) => {
    //lay zip code duoc request
    var zipcode = req.params[0];
    //lay thong tin vi tri tu ZIP CODE
    var location = zipdb.zipcode(zipcode);
    if(!location.zipcode) {
        next(new Error("Not found ZIP CODE"));
        return;
    }
    
    //neu co request zipcode thi tiep tuc con neu khon thi dung lai
    //lay vi do va kinh do
    var latitude    = location.latitude;
    var longitude   = location.longitude;
    weather.forecast(latitude,longitude,(err,data) => {
        if(err) {
            next(new Error("data error!"));
            return;
        }
        res.json({
            zipcode: location.zipcode,
            city: location.city,
            temperature: data.currently.temperature
        });
    });
});
app.use((err,req,res,next) => {
    res.status(404).send(err.message);
});
app.use((req,res) => {
    res.status(404).send("Not found page");
})
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});