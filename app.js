'use strict';

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

//Configurations
const config = require('./config/config.json');

//Middlewares
const routesMiddleware = require('./middlewares/errorRoutesMiddlewares.js');

//passport
const passport = require('passport');
const pass = require('./passport/user');

const app = express();

//Mongoose
mongoose.connect('mongodb://localhost/nodegame');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
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

app.listen(process.env.NODE_ENV === 'production' ? 80 : config.port, () => {
  console.log(config.name + ' initialized on port ' + config.port);
});
