const Jimp = require("jimp");

const getTimeImageBuffer = c => {
    return new Promise((resolve, reject) => {
        let imageData = [];
        let colorIndex;

        for(var i = 0; i < 64; i++) {
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

const newGetTimeImageBuffer = c => {
    return new Promise((resolve, reject) => {
        let imageData = [];
        let colorIndex;

        for(var i = 0; i < 36; i++) {

            if(i < 12) {
                colorIndex = ((i % 6) < 3) ? 0 : 1;
            } else if(i < 24) {
                colorIndex = ((i % 6) < 3) ? 2 : 3;
            } else {
                colorIndex = ((i % 6) < 3) ? 4 : 5;
            }

            imageData = imageData.concat([
                c[colorIndex][0],
                c[colorIndex][1],
                c[colorIndex][2],
            ]);
        }

        new Jimp({
            width : 6,
            height : 6,
            data : Buffer.from(imageData)
        }, (err, image) => {
            resolve(image.getBufferAsync(Jimp.MIME_JPEG));
        });
    });
}

const getRealTimeMoonImageBuffer = c => {
    return new Promise((resolve, reject) => {
        let imageData = [];
        let colorIndex;

        for(var i = 0; i < 144; i++) {
            if(i < 48) {
                colorIndex = 0;
            } else if(i < 96) {
                colorIndex = 1;
            } else {
                colorIndex = 2;
            }

            imageData = imageData.concat(c[colorIndex]);
        }

        new Jimp({
            width : 12,
            height : 12,
            data : Buffer.from(imageData)
        }, (err, image) => {
            resolve(image.getBufferAsync(Jimp.MIME_JPEG));
        });
    });
}

const getRealTimeSkyboxImageBuffer = c => {
    return new Promise((resolve, reject) => {
        let imageData = [];
        let colorIndex = 0;

        for(var i = 0; i < 50; i++) {
            if(i < 10) {
                colorIndex = i % 5;
            } else if(i < 20) {
                colorIndex = (i % 5) + 5;
            } else if(i < 30) {
                colorIndex = (i % 5) + 10;
            } else if(i < 40) {
                colorIndex = (i % 5) + 15;
            } else {
                colorIndex = (i % 5) + 20;
            }

            imageData = imageData.concat([c[colorIndex][0], c[colorIndex][1], c[colorIndex][2],], [c[colorIndex][0], c[colorIndex][1], c[colorIndex][2],]);
        }

        new Jimp({
            width : 10,
            height : 10,
            data : Buffer.from(imageData)
        }, (err, image) => {
            resolve(image.getBufferAsync(Jimp.MIME_JPEG));
        });
    });
}

module.exports = {
    getTimeImageBuffer: getTimeImageBuffer,
    newGetTimeImageBuffer: newGetTimeImageBuffer,
    getRealTimeMoonImageBuffer: getRealTimeMoonImageBuffer,
    getRealTimeSkyboxImageBuffer: getRealTimeSkyboxImageBuffer
}

