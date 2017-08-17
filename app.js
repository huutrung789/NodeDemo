const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//----
const session = require('express-session');
const errorHanlder = require('errorhandler');
const methodOveride = require('method-override');
const _ = require('lodash');
const request = require('request');
const  hbs = require('hbs');
const fs = require('fs');

const mongo = require('mongoskin');
var dbUrl = process.env.MONGOHQ_URL | 'mongodb://@localhost:27017/test';

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.locals.appTitle = 'My page - Trung';

//db
var db = mongo.db(dbUrl, {safe: true});
var collections = {
  articles: db.collection('articles'),
  users: db.collection('users')
};

//Register partials
hbs.registerPartials(__dirname + '/views/partial');

// view engine setup - configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//Create server log
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url} `;
    fs.appendFile('server.log',log + '\n');
    next();
});

//Middleware
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use(function (req, res, next) {
    if (!collections.articles && !collections.users) return next(new Error('No collections.'))
    req.collections = collections;
    return next()
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
