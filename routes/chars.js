'use strict';
const express = require('express');
const char = express.Router();
const UserSchema = require('../models/user');
const CharSchema = require('../models/char');
const auth = require('../util/auth');

/* GET users listing. */

char.use(auth.ensureAuthenticated);
char.post('/create', function(req, res) {
  let char = new CharSchema({
    name: req.body.name,
    class: req.body.class,
    race: req.body.race,
    account: req.user
  });

  char.save((err, char) => {
    if(err) return res.status(400).send({message: `Error ${err}`});

    req.session.char = char;

    return res.status(201).json({char: char});
  });
});

char.get('/select/:id', (req, res) => {
    let id = req.params.id;

    CharSchema.findOne({_id: id, account: req.user}, (err, char) => {
        if(err) return res.status(400).send({message: `Error ${err}`});

        if(!char) return res.status(400).send({message: `Nonexistent character`});

        req.session.char = char;

        return res.status(201).json({char: char});
    });
});

module.exports = char;
