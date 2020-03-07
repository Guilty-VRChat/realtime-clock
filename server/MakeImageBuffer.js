const GetImgBuf = require(__dirname + "/GetImageBuffer");

const makeTimeImageBuffer = (time, check) => { // 24.0, 60.0, 60.0
    return new Promise((resolve, reject) => {
        let h = Math.round(((time[0]) / 24.0) * 255.0);
        if(check == 1) {
            h = Math.round(((time[0]) / 12.0) * 255.0);
        }
        let m = Math.round(((time[1]) / 60.0) * 255.0);
        let s = Math.round(((time[2]) / 60.0) * 255.0);

        GetImgBuf.getTimeImageBufferWith4Colors([
            [h, m, s],
            [s, h, m],
            [m, s, h],
            [0, 0, 0]
        ]).then(buffer => {
            resolve(buffer);
        });
    });
};

const newMakeTimeImageBuffer = (time) => { // 12.0, 60.0, 60.0
    return new Promise((resolve, reject) => {
        let binaryTime = [("0000" + time[0].toString(2)).slice(-4), ("000000" + time[1].toString(2)).slice(-6),("000000" + time[2].toString(2)).slice(-6), ("0" + time[3].toString(2)).slice(-1)]
        let r00 = parseInt(binaryTime[0].charAt(0)) * 255;
        let g00 = parseInt(binaryTime[0].charAt(1)) * 255;
        let b00 = parseInt(binaryTime[0].charAt(2)) * 255;
        let r01 = parseInt(binaryTime[0].charAt(3)) * 255;
        let b01 = parseInt(binaryTime[3].charAt(0)) * 255;
        let r10 = parseInt(binaryTime[1].charAt(0)) * 255;
        let g10 = parseInt(binaryTime[1].charAt(1)) * 255;
        let b10 = parseInt(binaryTime[1].charAt(2)) * 255;
        let r11 = parseInt(binaryTime[1].charAt(3)) * 255;
        let g11 = parseInt(binaryTime[1].charAt(4)) * 255;
        let b11 = parseInt(binaryTime[1].charAt(5)) * 255;
        let r20 = parseInt(binaryTime[2].charAt(0)) * 255;
        let g20 = parseInt(binaryTime[2].charAt(1)) * 255;
        let b20 = parseInt(binaryTime[2].charAt(2)) * 255;
        let r21 = parseInt(binaryTime[2].charAt(3)) * 255;
        let g21 = parseInt(binaryTime[2].charAt(4)) * 255;
        let b21 = parseInt(binaryTime[2].charAt(5)) * 255;

        GetImgBuf.newGetTimeImageBuffer([
            [r00, g00, b00], [r01, 0, b01],
            [r10, g10, b10], [r11, g11, b11],
            [r20, g20, b20], [r21, g21, b21]
        ]).then(buffer => {
            resolve(buffer);
        });
    });
};

const makeRealTimeMoonImageBuffer = (moonAge) => {
    return new Promise((resolve, reject) => {
        let binaryTime = ("000000000" + moonAge.toString(2)).slice(-9);
        let r0 = parseInt(binaryTime.charAt(0)) * 255;
        let g0 = parseInt(binaryTime.charAt(1)) * 255;
        let b0 = parseInt(binaryTime.charAt(2)) * 255;
        let r1 = parseInt(binaryTime.charAt(3)) * 255;
        let g1 = parseInt(binaryTime.charAt(4)) * 255;
        let b1 = parseInt(binaryTime.charAt(5)) * 255;
        let r2 = parseInt(binaryTime.charAt(6)) * 255;
        let g2 = parseInt(binaryTime.charAt(7)) * 255;
        let b2 = parseInt(binaryTime.charAt(8)) * 255;

        GetImgBuf.getRealTimeMoonImageBuffer([
            [r0, g0, b0],
            [r1, g1, b1],
            [r2, g2, b2]
        ]).then(buffer => {
            resolve(buffer);
        });
    });
};

const makeRealTimeSkyboxImageBuffer = (moonAge, sunSign, sunAltitude, sunAzimuth, moonSign, moonAltitude, moonAzimuth, time) => {  // 9 10 12 10 12 4+1 6 6 = 70
    return new Promise((resolve, reject) => {
        let binaryMoonAge = ("000000000" + moonAge.toString(2)).slice(-9)
        let ma_0 = parseInt(binaryMoonAge.charAt(0)) * 255;
        let ma_1 = parseInt(binaryMoonAge.charAt(1)) * 255;
        let ma_2 = parseInt(binaryMoonAge.charAt(2)) * 255;
        let ma_3 = parseInt(binaryMoonAge.charAt(3)) * 255;
        let ma_4 = parseInt(binaryMoonAge.charAt(4)) * 255;
        let ma_5 = parseInt(binaryMoonAge.charAt(5)) * 255;
        let ma_6 = parseInt(binaryMoonAge.charAt(6)) * 255;
        let ma_7 = parseInt(binaryMoonAge.charAt(7)) * 255;
        let ma_8 = parseInt(binaryMoonAge.charAt(8)) * 255;

        let binarySunAltitude = ("0000000000" + sunAltitude.toString(2)).slice(-10)
        let sal_0 = parseInt(binarySunAltitude.charAt(0)) * 255;
        let sal_1 = parseInt(binarySunAltitude.charAt(1)) * 255;
        let sal_2 = parseInt(binarySunAltitude.charAt(2)) * 255;
        let sal_3 = parseInt(binarySunAltitude.charAt(3)) * 255;
        let sal_4 = parseInt(binarySunAltitude.charAt(4)) * 255;
        let sal_5 = parseInt(binarySunAltitude.charAt(5)) * 255;
        let sal_6 = parseInt(binarySunAltitude.charAt(6)) * 255;
        let sal_7 = parseInt(binarySunAltitude.charAt(7)) * 255;
        let sal_8 = parseInt(binarySunAltitude.charAt(8)) * 255;
        let sal_9 = parseInt(binarySunAltitude.charAt(9)) * 255;

        let binarySunAzimuth = ("000000000000" + sunAzimuth.toString(2)).slice(-12)
        let saz_0 = parseInt(binarySunAzimuth.charAt(0)) * 255;
        let saz_1 = parseInt(binarySunAzimuth.charAt(1)) * 255;
        let saz_2 = parseInt(binarySunAzimuth.charAt(2)) * 255;
        let saz_3 = parseInt(binarySunAzimuth.charAt(3)) * 255;
        let saz_4 = parseInt(binarySunAzimuth.charAt(4)) * 255;
        let saz_5 = parseInt(binarySunAzimuth.charAt(5)) * 255;
        let saz_6 = parseInt(binarySunAzimuth.charAt(6)) * 255;
        let saz_7 = parseInt(binarySunAzimuth.charAt(7)) * 255;
        let saz_8 = parseInt(binarySunAzimuth.charAt(8)) * 255;
        let saz_9 = parseInt(binarySunAzimuth.charAt(9)) * 255;
        let saz_10 = parseInt(binarySunAzimuth.charAt(10)) * 255;
        let saz_11 = parseInt(binarySunAzimuth.charAt(11)) * 255;

        let binaryMoonAltitude = ("0000000000" + moonAltitude.toString(2)).slice(-10)
        let mal_0 = parseInt(binaryMoonAltitude.charAt(0)) * 255;
        let mal_1 = parseInt(binaryMoonAltitude.charAt(1)) * 255;
        let mal_2 = parseInt(binaryMoonAltitude.charAt(2)) * 255;
        let mal_3 = parseInt(binaryMoonAltitude.charAt(3)) * 255;
        let mal_4 = parseInt(binaryMoonAltitude.charAt(4)) * 255;
        let mal_5 = parseInt(binaryMoonAltitude.charAt(5)) * 255;
        let mal_6 = parseInt(binaryMoonAltitude.charAt(6)) * 255;
        let mal_7 = parseInt(binaryMoonAltitude.charAt(7)) * 255;
        let mal_8 = parseInt(binaryMoonAltitude.charAt(8)) * 255;
        let mal_9 = parseInt(binaryMoonAltitude.charAt(9)) * 255;

        let binaryMoonAzimuth = ("000000000000" + moonAzimuth.toString(2)).slice(-12)
        let maz_0 = parseInt(binaryMoonAzimuth.charAt(0)) * 255;
        let maz_1 = parseInt(binaryMoonAzimuth.charAt(1)) * 255;
        let maz_2 = parseInt(binaryMoonAzimuth.charAt(2)) * 255;
        let maz_3 = parseInt(binaryMoonAzimuth.charAt(3)) * 255;
        let maz_4 = parseInt(binaryMoonAzimuth.charAt(4)) * 255;
        let maz_5 = parseInt(binaryMoonAzimuth.charAt(5)) * 255;
        let maz_6 = parseInt(binaryMoonAzimuth.charAt(6)) * 255;
        let maz_7 = parseInt(binaryMoonAzimuth.charAt(7)) * 255;
        let maz_8 = parseInt(binaryMoonAzimuth.charAt(8)) * 255;
        let maz_9 = parseInt(binaryMoonAzimuth.charAt(9)) * 255;
        let maz_10 = parseInt(binaryMoonAzimuth.charAt(10)) * 255;
        let maz_11 = parseInt(binaryMoonAzimuth.charAt(11)) * 255;

        let binaryTime = [("0000" + time[0].toString(2)).slice(-4), ("000000" + time[1].toString(2)).slice(-6),("000000" + time[2].toString(2)).slice(-6), ("0" + time[3].toString(2)).slice(-1)]

        let t_0 = parseInt(binaryTime[0].charAt(0)) * 255;
        let t_1 = parseInt(binaryTime[0].charAt(1)) * 255;
        let t_2 = parseInt(binaryTime[0].charAt(2)) * 255;
        let t_3 = parseInt(binaryTime[0].charAt(3)) * 255;
        let t_4 = parseInt(binaryTime[3].charAt(0)) * 255;
        let t_5 = parseInt(binaryTime[1].charAt(0)) * 255;
        let t_6 = parseInt(binaryTime[1].charAt(1)) * 255;
        let t_7 = parseInt(binaryTime[1].charAt(2)) * 255;
        let t_8 = parseInt(binaryTime[1].charAt(3)) * 255;
        let t_9 = parseInt(binaryTime[1].charAt(4)) * 255;
        let t_10 = parseInt(binaryTime[1].charAt(5)) * 255;
        let t_11 = parseInt(binaryTime[2].charAt(0)) * 255;
        let t_12 = parseInt(binaryTime[2].charAt(1)) * 255;
        let t_13 = parseInt(binaryTime[2].charAt(2)) * 255;
        let t_14 = parseInt(binaryTime[2].charAt(3)) * 255;
        let t_15 = parseInt(binaryTime[2].charAt(4)) * 255;
        let t_16 = parseInt(binaryTime[2].charAt(5)) * 255;

        GetImgBuf.getRealTimeSkyboxImageBuffer([
            [ma_0, ma_1, ma_2], [ma_3, ma_4, ma_5], [ma_6, ma_7, ma_8], [sunSign, sal_0, sal_1], [sal_2, sal_3, sal_4],
            [sal_5, sal_6, sal_7], [sal_8, sal_9, saz_0], [saz_1, saz_2, saz_3], [saz_4, saz_5, saz_6], [saz_7, saz_8, saz_9],
            [saz_10, saz_11, moonSign], [mal_0, mal_1, mal_2], [mal_3, mal_4, mal_5], [mal_6, mal_7, mal_8], [mal_9, maz_0, maz_1],
            [maz_2, maz_3, maz_4], [maz_5, maz_6, maz_7], [maz_8, maz_9, maz_10], [maz_11, t_0, t_1], [t_2, t_3, t_4],
            [t_5, t_6, t_7], [t_8, t_9, t_10], [t_11, t_12, t_13], [t_14, t_15, t_16], [0, 0, 0]
        ]).then(buffer => {
            resolve(buffer);
        });
    });
};

module.exports = {
    makeTimeImageBuffer: makeTimeImageBuffer,
    newMakeTimeImageBuffer: newMakeTimeImageBuffer,
    makeRealTimeMoonImageBuffer: makeRealTimeMoonImageBuffer,
    makeRealTimeSkyboxImageBuffer: makeRealTimeSkyboxImageBuffer,
}

