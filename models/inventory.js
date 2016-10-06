'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const ItemSchema = require('./item.js');
const CharSchema = require('./char.js');

const InventorySchema = new Schema({
  item: [{type: Schema.Types.ObjectId, ref: 'ItemSchema'}],
  quantity: {
    type: Number,
    default: 1
  },
  slot: {
    type: Number,
    defualt: 0
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

module.exports = mongoose.model('Inventory', InventorySchema);