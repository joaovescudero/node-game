'use strict';

const passport = require('passport');
const Strategy = require('passport-local');
const userModel = require('../models/user');
const bCrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userModel.findById(id, function (err, user) {
  if (err) { return done(err); }
  done(null, user);
  });
});

passport.use('login', new Strategy({passReqToCallback : true},
  function(req, username, password, done) {
    userModel.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!isValidPassword(user, password)) { return done(null, false); }
      req.session.user = user;
      return done(null, user);
    });
  }
));

passport.use('signup', new Strategy({passReqToCallback : true},
  function(req, username, password, done) {
    findOrCreateUser = function(){
      userModel.findOne({ 'username' :  username }, function(err, user) {
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        if (user) {
          console.log('User already exists with username: '+username);
          return done(null, false);
        }
        else {
          const newUser = new userModel();

          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email    = req.param('email');
          newUser.birthday = req.param('birthday');
          newUser.secQuest = req.param('secQuest');
          newUser.secAns   = req.param('secAns');

          newUser.save(function(err) {
          if (err){
            console.log('Error in Saving user: '+err);
            throw err;
          }
          console.log('User Registration succesful');
          return done(null, newUser);
          });
        }
      });
    };
  process.nextTick(findOrCreateUser);
  })
);

const isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

const createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
