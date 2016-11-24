var express         = require('express'),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    expressSession  = require('express-session'),
    bCrypt          = require('bcryptjs'),
    User,
    location;
// var localStrategy = require('passport-local').Strategy;
// var ConnectRoles = require('connect-roles');

// Database
mongoose.connect('mongodb://IMarks:pikapika@ds031852.mlab.com:31852/pokedex');
var db = mongoose.connection;

db.on('error', function (msg) {
  console.log("db connection failed.");
});

db.once('open', function() {
  console.log("db connection succeeded.");
});

require('./model/user')(mongoose);
require('./model/role')(mongoose);
require('./model/location')(mongoose);
require('./model/pokemon')(mongoose);
require('./model/type')(mongoose);

function handleError(req, res, statusCode, message){
  res.status(statusCode);
  res.json(message);
}

var indexRoute    = require('./routes/index');
var userRoute     = require('./routes/users');
var adminRoute    = require('./routes/admin');
var mapRoute      = require('./routes/map');
var pokemonRoute  = require('./routes/pokemons');
var typeRoute     = require('./routes/types');
// var chatRoute     = require('./routes/chat');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));


require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({
  limit: "200mb"
}));
app.use(bodyParser.urlencoded({ extended: false, limit: "200mb" }));
app.use(cookieParser());
//app.use(expressSession({secret: "pikapika"}));
//app.use(cookieParser());

app.use(expressSession({secret: "pikapika", saveUninitialized: true, resave: false}));
app.use(passport.initialize());
app.use(passport.session());

// var auth = require('./controller/auth');
var roles = require('./config/roles')();

app.use('/', indexRoute);
app.use('/users', userRoute);
app.use('/admin', adminRoute);
app.use('/map', mapRoute);
app.use('/pokemon', pokemonRoute);
app.use('/type', typeRoute);
// app.use('/chat', chatRoute);

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