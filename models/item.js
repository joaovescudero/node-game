'use strict';

const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const EffectSchema = require('./effect');

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  slot: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
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
  effect: [{type: Schema.Types.ObjectId, ref: 'EffectSchema'}]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('Item', ItemSchema);