'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const CharSchema = require('./char.js');
const SkillSchema = require('./skill.js');

const CharSkillsSchema = new Schema({
  skill: [{type: Schema.Types.ObjectId, ref: 'SkillSchema'}],
  level: {
    type: Number,
    default: 1
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

module.exports = mongoose.model('CharSkills', CharSkillsSchema);