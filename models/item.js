'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  stats: {
    type: Object,
    default: {
      STR: {
        type: Number,
        default: 0
      },
      VIT: {
        type: Number,
        default: 0
      },
      DEX: {
        type: Number,
        default: 0
      },
      AGI: {
        type: Number,
        default: 0
      },
      INT: {
        type: Number,
        default: 0
      },
      LUK: {
        type: Number,
        default: 0
      }
    }
  },
  effect: Object
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('Item', ItemSchema);