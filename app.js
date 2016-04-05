var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var localStrategy = require('passport-local').Strategy;
var ConnectRoles = require('connect-roles');
var bCrypt = require('bcryptjs');
var User;
var location;

var roles = new ConnectRoles({
  failureHandler: function(req, res, event){
    res.status(401);
    res.render('noauth');
  }
});

// Database
mongoose.connect('mongodb://IMarks:pikapika@ds031852.mlab.com:31852/pokedex');
//mongoose.connect('mongodb://localhost:27017/assessment');

require('./model/user')(mongoose);
require('./model/location')(mongoose);
require('./model/pokemon')(mongoose);

function handleError(req, res, statusCode, message){
  res.status(statusCode);
  res.json(message);
}

var routes = require('./routes/index');
var users = require('./routes/users');
var map = require('./routes/map');
var pokemons = require('./routes/pokemons');
var admin = require('./routes/admin');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));


require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(expressSession({secret: "pikapika"}));
//app.use(cookieParser());

app.use(expressSession({secret: "pikapika", saveUninitialized: true, resave: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/map', map);
app.use('/pokemon', pokemons);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
