const request = require("request");
const tzlookup = require("tz-lookup");
const moment = require("moment-timezone");
const SunCalc = require("suncalc");
const MakeImgBuf = require(__dirname + "/MakeImageBuffer");

var cachedLats = {};
var cachedLons = {};
var cachedTzs = {};

// Clear cache once a week
setInterval(() => {
    cachedLats = {};
    cachedLons = {};
    cachedTzs = {};
}, 1000 * 60 * 60 * 24 * 7);

const TimeInImage = function(app) {
    this.onRequest = () => {};

    app.get("/:type", (req, res) => {
        this.onRequest(req);
        res.header({"Content-Type" : "image/jpg"});

        let ip = "0.0.0.0"
        if (req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'];
        } else if (req.connection && req.connection.remoteAddress) {
            ip = req.connection.remoteAddress;
        } else if (req.connection.socket && req.connection.socket.remoteAddress) {
            ip = req.connection.socket.remoteAddress;
        } else if (req.socket && req.socket.remoteAddress) {
            ip = req.socket.remoteAddress;
        }

        ip = (ip + ".").match(/(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){4}/)[0].slice(0, -1);
        console.log("IP Address : " + ip);

        if(cachedTzs[ip]) {
            let time = moment().tz(cachedTzs[ip]).format("HH:mm:ss").split(":").map(x => parseInt(x));
            let date = moment().tz(cachedTzs[ip]).toDate();
            let moonAge = Math.round(SunCalc.getMoonIllumination(date).phase * 30.0 * 10.0);
            let sun = SunCalc.getPosition(date, cachedLats[ip], cachedLons[ip]);
            let sunAltitude = Math.round(sun.altitude * 180.0 / 3.14159265 * 10.0);
            let sunAzimuth = Math.round((sun.azimuth * 180.0 / 3.14159265 + 360.0) % 360.0 * 10.0);
            let moon = SunCalc.getMoonPosition(date, cachedLats[ip], cachedLons[ip]);
            let moonAltitude = Math.round(moon.altitude * 180.0 / 3.14159265 * 10.0);
            let moonAzimuth = Math.round((moon.azimuth * 180.0 / 3.14159265 + 360.0) % 360.0 * 10.0);

            let ampm = "";
            if(Math.round(time[0]) < 12) {
                time[3] = 0;
                ampm = "AM";
            } else {
                time[0] -= 12;
                time[3] = 1;
                ampm = "PM";
            }
            let sunSign = 0;
            if(sunAltitude > 0.0) {
                sunSign = 1;
                sunAltitude = Math.abs(sunAltitude);
            }
            let moonSign = 0;
            if(moonAltitude > 0.0) {
                moonSign = 1;
                moonAltitude = Math.abs(moonAltitude);
            }

            console.log("Type : " + req.params.type + "\n");
            switch(req.params.type) {
                case "RealTime":
                    MakeImgBuf.newMakeTimeImageBuffer(time).then(buffer => {
                        res.end(buffer);
                    });
                    break;
                case "RealTimeMoon":
                    MakeImgBuf.makeRealTimeMoonImageBuffer(moonAge).then(buffer => {
                        res.end(buffer);
                    });
                    break;
                case "RealTimeSkybox":
                    MakeImgBuf.makeRealTimeSkyboxImageBuffer(moonAge, sunSign, sunAltitude, sunAzimuth, moonSign, moonAltitude, moonAzimuth, time).then(buffer => {
                        res.end(buffer);
                    });
                    break;
                default:
                    MakeImgBuf.newMakeTimeImageBuffer(time).then(buffer => {
                        res.end(buffer);
                    });
                    break;
            }

            return;
        }

        request.get({
            url : "http://ip-api.com/json/" + ip,
            json : true
        }, (err, _, body) => {
            if(err) {
                console.log(err);
                return res.send();
            } try {
                console.log(body);
                cachedLats[ip] = body.lat;
                cachedLons[ip] = body.lon;
                cachedTzs[ip] = tzlookup(body.lat, body.lon);
                let time = moment().tz(cachedTzs[ip]).format("HH:mm:ss").split(":").map(x => parseInt(x));
                let date = moment().tz(cachedTzs[ip]).toDate();
                let moonAge = Math.round(SunCalc.getMoonIllumination(date).phase * 30.0 * 10.0);
                let sun = SunCalc.getPosition(date, cachedLats[ip], cachedLons[ip]);
                let sunAltitude = Math.round(sun.altitude * 180.0 / 3.14159265 * 10.0);
                let sunAzimuth = Math.round((sun.azimuth * 180.0 / 3.14159265 + 360.0) % 360.0 * 10.0);
                let moon = SunCalc.getMoonPosition(date, cachedLats[ip], cachedLons[ip]);
                let moonAltitude = Math.round(moon.altitude * 180.0 / 3.14159265 * 10.0);
                let moonAzimuth = Math.round((moon.azimuth * 180.0 / 3.14159265 + 360.0) % 360.0 * 10.0);

                let ampm = "";
                if(Math.round(time[0]) < 12) {
                    time[3] = 0;
                    ampm = "AM";
                } else {
                    time[0] -= 12;
                    time[3] = 1;
                    ampm = "PM";
                }
                let sunSign = 0;
                if(sunAltitude > 0.0) {
                    sunSign = 1;
                    sunAltitude = Math.abs(sunAltitude);
                }
                let moonSign = 0;
                if(moonAltitude > 0.0) {
                    moonSign = 1;
                    moonAltitude = Math.abs(moonAltitude);
                }

                console.log("Type : " + req.params.type + "\n");
                switch(req.params.type) {
                    case "RealTime":
                        MakeImgBuf.newMakeTimeImageBuffer(time).then(buffer => {
                            res.end(buffer);
                        });
                        break;
                    case "RealTimeMoon":
                        MakeImgBuf.makeRealTimeMoonImageBuffer(moonAge).then(buffer => {
                            res.end(buffer);
                        });
                        break;
                    case "RealTimeSkybox":
                        MakeImgBuf.makeRealTimeSkyboxImageBuffer(moonAge, sunSign, sunAltitude, sunAzimuth, moonSign, moonAltitude, moonAzimuth, time).then(buffer => {
                            res.end(buffer);
                        });
                        break;
                    default:
                        MakeImgBuf.newMakeTimeImageBuffer(time).then(buffer => {
                            res.end(buffer);
                        });
                        break;
                }
            } catch(err) {
                console.log("--------Error--------\n", err);
                res.send();
            }
        });
    });
}

module.exports = TimeInImage;

