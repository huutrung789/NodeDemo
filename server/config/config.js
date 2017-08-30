
var env = process.env.NODE_ENV || 'development';
if (env === 'development' || env === 'Test') {
    var config = require('./config.json');
    var configEnv = config[env];
    console.log(configEnv);
    Object.keys(configEnv).forEach((key) => {
        process.env[key] = configEnv[key];
    });
}