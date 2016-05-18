'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const SkillSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  effect: {
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