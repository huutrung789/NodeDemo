
const  mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Database URI: process.env.MONGODB_URI - build production or Heroku
//Database URI: mongodb://localhost:27017/Todos - local
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Todos', {
   useMongoClient: true
});

module.exports = {
    mongoose
}