var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var compression = require('compression');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var dev = app.get('env') !== 'production';

if (!dev) {
  app.disable('x-powered-by');
  app.use(morgan('common'));
  app.use(compression());
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/', index);
app.use('/users', users);

mongoose.connect('mongodb://nilesh:gremlin@ds243085.mlab.com:43085/family', {
  useMongoClient: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function() {
  console.log('connected');
})

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
