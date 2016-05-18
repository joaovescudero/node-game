'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const CharSchema = require('./char.js');

const RaceSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  bonus: {
    type: String,
    required: true
  },
  leader: [CharSchema]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('Race', RaceSchema);