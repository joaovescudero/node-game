'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const Char = require('./char.js');

const RaceSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  basicAttributes: {
    type: Object,
    required: true
  },
  leader: [{type: Schema.Types.ObjectId, ref: 'Char'}]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('Race', RaceSchema);