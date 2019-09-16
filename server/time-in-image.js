const fs = require("fs");
const request = require("request");
const Jimp = require("jimp");
const tzlookup = require("tz-lookup");
const moment = require("moment-timezone");
const exec = require("child_process").exec;

const make8x8ImageBufferWith4Colors = c => {
	return new Promise((resolve, reject) => {
		let imageData = [];

		for(var i = 0; i < 64; i++) {
			let colorIndex;

			if(i < 32) {
				colorIndex = ((i % 8) < 4) ? 0 : 1;
			} else {
				colorIndex = ((i % 8) < 4) ? 2 : 3;
			}

			imageData = imageData.concat([
				c[colorIndex][0],
				c[colorIndex][1],
				c[colorIndex][2],
			]);
		}

		new Jimp({
			width : 8,
			height : 8,
			data : Buffer.from(imageData)
		}, (err, image) => {
			resolve(image.getBufferAsync(Jimp.MIME_JPEG));
		});
	});
}

const makeTimeImageBuffer = (time) => { // 24.0, 60.0, 60.0
	return new Promise((resolve, reject) => {
		let h = Math.round(((time[0]) / 24.0) * 255.0);
		let m = Math.round(((time[1]) / 60.0) * 255.0);
		let s = Math.round(((time[2]) / 60.0) * 255.0);

		make8x8ImageBufferWith4Colors([
			[h, m, s],
			[s, h, m],
			[m, s, h],
			[0, 0, 0]
		]).then(buffer => {
			resolve(buffer);
		});
	});
};

var cachedTzs = {};
setInterval(() => {
	cachedTzs = {};
}, 1000 * 60 * 60 * 24 * 7);

const TimeInImage = function(app, path) {
	this.onRequest = () => {};
	var timeStr = "";

	app.get(path + "/:random", (req, res) => {
		this.onRequest(req);
		res.header({"Content-Type" : "image/jpg"});
		let ip = (req.ip.split(":")[3]);

		if(cachedTzs[ip]) {
			var time = moment().tz(cachedTzs[ip]).format("HH:mm:ss").split(":").map(x => parseInt(x));

			var ampm = "AM";
			if(Math.round(time[0]) >= 12) {
				time[0] -= 12;
				ampm = "PM";
			}
			timeStr = ampm + String(Math.round(time[0])) + "h" + String(Math.round(time[1])) + "m" + String(Math.round(time[2])) + "s";

			makeTimeImageBuffer(time).then(buffer => {
				res.end(buffer);
			});

			return;
		}

		request.get({
			url : "http://ip-api.com/json",
			form : {query : ip},
			json : true
		}, (err, _, body) => {
			if(err) {
				console.log(err);
				return res.send();
			} try {
				console.log(body);
				let tz = tzlookup(body.lat, body.lon);
				cachedTzs[ip] = tz;
				var time = moment().tz(tz).format("HH:mm:ss").split(":").map(x => parseInt(x));

				var ampm = "AM"
				if(Math.round(time[0]) >= 12) {
					time[0] -= 12;
					ampm = "PM";
				}
				timeStr = ampm + String(Math.round(time[0])) + "h" + String(Math.round(time[1])) + "m" + String(Math.round(time[2])) + "s";

				makeTimeImageBuffer(time).then(buffer => {
					res.end(buffer);
				});
			} catch(err) {
				console.log(err);
				res.send();
			}
		});
	});

	app.get(path, (req, res) => {
		res.redirect(path + "/" + "VRCClock" + "_" + timeStr + ".jpg");
	});
}

module.exports = TimeInImage;

