<<<<<<< HEAD
"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Schemas
const UserSchema = require('./models/user.js');
const CharSchema = require('./models/char.js');
const ItemSchema = require('./models/item.js');
const RaceSchema = require('./models/race.js');
const SkillSchema = require('./models/skill.js');
const EffectSchema = require('./models/effect.js');
const InvetorySchema = require('./models/inventory.js');
const CharStatSchema = require('./models/charstat.js');
const CharSkillsSchema = require('./models/charskills.js');

//Middlewares
const routesMiddleware = require('./middlewares/errorRoutesMiddlewares.js');

const app = express();

//Mongoose
mongoose.connect('mongodb://localhost/nodegame');
=======
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
>>>>>>> 7b28968aa74ef12685071e48084912a3c9157be0

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
<<<<<<< HEAD
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

// error 404
app.use(routesMiddleware.notFound);

// error 500
app.use(routesMiddleware.serverError);

app.listen(3000, () => {
    console.log('Server initialized');
});
=======
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

app.listen(3000, () => {
    console.log('Server initialized');
  });
>>>>>>> 7b28968aa74ef12685071e48084912a3c9157be0
