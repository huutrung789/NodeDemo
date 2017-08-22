
const request = require('request');
const weather = require('./waether');
const  yarg = require('yargs').argv;
const  weathePromise = require('./promises');

var url = 'http://maps.googleapis.com/maps/api/geocode/json?language=ja&address=6495312';
request({
    url : url,
    json: true
}, (error, response, body) => {
    if (response.statusCode === 200) {
        console.log(JSON.stringify(body, undefined, 2));
        console.log(body.results[0].geometry.location.lng);
        console.log(body.results[0].geometry.location.lat);
        var lat = body.results[0].geometry.location.lat;
        var lng = body.results[0].geometry.location.lng;

        //callback
        // weather.weather(lat,lng, (errorMessage, body) => {
        //     if (errorMessage) {
        //         console.log(errorMessage);
        //     } else {
        //         console.log(body);
        //     }
        // });
        //Call weathe API by promises

        //Promises
        weathePromise.callWeatherAPI(lat, lng).then((result) => {
            console.log('Call API Weathe - Promises:', result);
        }).catch((errorMessage) => {
            console.log('Call API weathe error:', errorMessage);
        });

    } else  if (error) {
        console.log('can not fetch address');
    }

});

// var getUser = (id, callback) => {
//     var user = {
//         id: id,
//         name: 'Trung'
//     };
//     callback(user);
// };
//
// getUser(12, (user) => {
//     console.log(user);
// });




