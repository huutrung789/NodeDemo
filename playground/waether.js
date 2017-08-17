const  request = require('request');

var weather = (lat, long, callback) => {
  request({
      url: `https://api.forecast.io/forecast/44960382a282a9c1a86b85ca75a8f0f4/${lat},${long}`,
      json: true
  }, (error, response, body) => {
        if (error) {
            callback('Can not connect to forecast');
        } else if (response.statusCode === 400) {
            callback('Can not fetch data from address');
        } else if (response.statusCode === 200) {
            callback(undefined, body);
        }
    });
};

module.exports = {
    weather
};