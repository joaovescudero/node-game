/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const async = require('async');

//Schemas
const ItemSchema = require('./models/item.js');
const UserSchema = require('./models/user.js');
const CharSchema = require('./models/char.js');
const RaceSchema = require('./models/race.js');
const SkillSchema = require('./models/skill.js');
const InvetorySchema = require('./models/inventory.js');
const CharSkillsSchema = require('./models/charskills.js');


//Configurations
const config = require('./config/config.json');
const race = require('./config/races');

async.eachOfLimit(race, 1, (value, key, cb) => {
  let basicAttributes = value.basicAttributes;
  
  RaceSchema.findOneAndUpdate({name: key}, {basicAttributes: basicAttributes}, {new: true})
  .exec((err, race) => {
    console.log(race);
    if(err || !race)
      return cb('err');
    return cb();
  });
}, (err) => {
  if(err)
    return console.log(`Error starting races`);
  
  return console.log(`All races started`);
});


//Middlewares
const routesMiddleware = require('./middlewares/errorRoutesMiddlewares.js');

//Routes
const users = require('./routes/users');
const chars = require('./routes/chars');
const races = require('./routes/races');

const app = express();

//Socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

//Mongoose
mongoose.connect('mongodb://localhost/nodegame');

//Allowing Cross Domain
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

//config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(expressValidator());
app.use(require('express-status-monitor')());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'nodegameasdasasdsadssa',
  resave: true,
  saveUninitialized: true
}));

app.get('/', function(req, res) {
  res.render('index', {
      title: 'Express'
  });
});

app.use(users);
app.use(chars);
app.use('/races', races);
require('./routes/io')(io);

// error 404
app.use(routesMiddleware.notFound);

// error 500
app.use(routesMiddleware.serverError);

server.listen(8888);
app.listen(process.env.NODE_ENV === 'production' ? 80 : config.port, () => {
  console.log(config.name + ' initialized on port ' + config.port);
});
