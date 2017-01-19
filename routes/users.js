/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const express = require('express');
const user = express.Router();
const UserSchema = require('../models/user.js');
const jwt = require('jwt-simple');
const auth = require('../util/auth.js');

/* GET users listing. */

user.post('/register', function(req, res) {
  let user = new UserSchema({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    birthday: req.body.birthday,
    secQuestion: req.body.secQuestion,
    secAnswer: req.body.secAnswer
  });
  
  user.save((err) => {
    if(err) return res.status(400).send({message: `Error ${err}`});

    return res.status(201).json({token: auth.createJWT(user)});
  });
});

user.post('/login', function(req, res) {
  UserSchema.findOne({username: req.body.username}, (err, userFound) => {
    if(!userFound) {
      return res.status(401).json({message: 'Wrong username and/or password'});
    }

    userFound.comparePassword(req.body.password, (err, match) => {
      if(!match) {
        return res.status(401).send({message: 'Wrong username and/or password'});
      }

      if(err){
        return res.status(401).json({error: err});
      }
      
      res.send({token: auth.createJWT(userFound)});
    });
  });
});

module.exports = user;
