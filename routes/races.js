/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

//Requeires
const express = require('express');
const async = require('async');
const race = express.Router();

//Models
const UserSchema = require('../models/user.js');
const CharSchema = require('../models/char.js');
const RaceSchema = require('../models/race.js');

//Middlewares
const auth = require('../util/auth');

//Configurations
const classes = require('../config/classes');
const races = require('../config/races');
const levelExp = require('../config/level');
const levelStats = require('../config/stats');

race.get('/listAll', (req, res) => {
  RaceSchema.find({})
  .exec((err, races) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!races) return res.status(400).json({message: `Nonexistent races`});
    
    res.status(200).json({races});
  });
});

race.use(auth.ensureAuthenticated);
race.post('/changeLeader', (req, res) => {
  let raceId = req.body.id;
  let charId = req.body.charId;


  CharSchema.findById(charId)
  .exec((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!char) return res.status(400).json({message: `Nonexistent character`});

    RaceSchema.findOneAndUpdate({_id: raceId}, {leader: char._id}, {new: true})
    .populate('leader')
    .exec((err, race) => {
      if(err || !race)
        return res.status(400).json({message: `No races found`});
      
      if(race.name != char.race)
        return res.status(401).json({message: `The character ${char._id} cant assume the leader position`});

      res.status(201).json(race);
    });
  });
});

module.exports = race;