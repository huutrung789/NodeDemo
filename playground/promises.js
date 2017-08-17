
const  request = require('request');

// var asyncAdd = (a, b) => {
//   return new Promise((resolved, reject) => {
//     if ((typeof  a === 'number') && (typeof b === 'number')) {
//         resolved(a+b);
//     } else {
//         reject('Arguments must be numbers.')
//     }
//   });
// };
//
// asyncAdd(5,'4').then((result) => {
//     console.log('Result:',result);
// }).catch((errorMessage) => {
//     console.log('Error:', errorMessage);
// });


// var promises = new Promise((resolved, reject) => {
//     reject('Fail');
//     // resolved('success');
// });
//
//
// promises.then((message) => {
//     console.log(`Success: ${message}`);
// }, (errorMessage) => {
//     console.log(`Fail: ${errorMessage}`);
// });

var callWeatherAPI = (lat, long) => {
    return new Promise((result, errorMessage) => {
        request({
            url: `https://api.forecast.io/forecast/44960382a282a9c1a86b85ca75a8f0f4/${lat},${long}`,
            json: true
        }, (error, response, body) => {

                if (error) {
                    // callback('Can not connect to forecast');
                    errorMessage(error);
                } else if (response.statusCode === 400) {

                    // callback('Can not fetch data from address');
                    errorMessage('Can not fetch data from address')
                } else if (response.statusCode === 200) {
                    // callback(undefined, body);
                    result(body);
                }

        });

    });
};

module.exports = {
    callWeatherAPI
}