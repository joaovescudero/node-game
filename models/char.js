'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const UserSchema = require('./user.js');

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
  account: [{type: Schema.Types.ObjectId, ref: 'UserSchema'}]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('Char', CharSchema);