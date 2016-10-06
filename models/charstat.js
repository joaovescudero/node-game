'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const CharSchema = require('./char.js');

const CharStatsSchema = new Schema({
  strength: {
    type: Number,
    default: 0
  },
  vitality: {
    type: Number,
    default: 0
  },
  dexterity: {
    type: Number,
    default: 0
  },
  agility: {
    type: Number,
    default: 0
  },
  intelligence: {
    type: Number,
    default: 0
  },
  lucky: {
    type: Number,
    default: 0
  },
  char: [{type: Schema.Types.ObjectId, ref: 'CharSchema'}]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('CharStats', CharStatsSchema);