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

var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

var roles = new ConnectRoles({
  failureHandler: function(req, res, event){
    res.status(401);
    res.render('noauth'); // @TODO: make .jade
  }
});

// Database
mongoose.connect('mongodb://IMarks:pikapika@ds031852.mlab.com:31852/pokedex');
//mongoose.connect('mongodb://localhost:27017/assessment');

require('./model/user')(mongoose);

function handleError(req, res, statusCode, message){
  res.status(statusCode);
  res.json(message);
}

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin')(mongoose, handleError);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({secret: "pikapika", saveUninitialized: false, resave: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(roles.middleware());

app.use('/', routes);
app.use('/users', users);
app.use('/admin', roles.can('access pokemons'), admin);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
})

passport.use(new localStrategy(function(username, password, done) {
  process.nextTick(function() {
    User = mongoose.model('User');
    User.findOne({
      'local.username': username,
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      if (user.local.password != password) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
}));

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/users/loginSuccess',
    failureRedirect: '/users/loginFailure',
  })
);  

roles.use('access admin', function(req){
  if (req.user){
    var roles = req.user.roles;
    if (roles.indexOf('admin') >= 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  res.send("Password is: " + bCrypt.hashSync("Welkom01", null, null));
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
