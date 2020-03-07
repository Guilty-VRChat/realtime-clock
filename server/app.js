const port = 8080;

const express = require("express");
const helmet = require("helmet");
const TimeInImage = require(__dirname + "/TimeInImage");

var app = express();
app.use(helmet());

var timeInImage = new TimeInImage(app);
timeInImage.onRequest = req => {
    console.log("--------Requested--------");
}

app.listen(port, () => {
    console.log("Web Server Opened At - PublicIP:" + port + "/:type\n");
});

