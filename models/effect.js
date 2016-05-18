'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const CharSchema = require('./char.js');

const EffectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  bonus: {
    type: String,
    required: true
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('Effect', EffectSchema);