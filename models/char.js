'use strict';

const mongoose   = require('mongoose');
const UserSchema = require('./user.js');
const Item = require('./item.js');
const Schema     = mongoose.Schema;

const CharSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: String,
    required: true
  },
  race: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  money: {
    type: Number,
    default: 0
  },
  stats: Object,
  equipment: [{type: Schema.Types.ObjectId, ref: 'Item'}],
  account: [{type: Schema.Types.ObjectId, ref: 'UserSchema'}],
  reborns: {
    type: Number,
    default: 0
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('Char', CharSchema);