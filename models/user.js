'use strict';

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const bcrypt     = require('bcrypt-nodejs');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  secQuestion: {
    type: String,
    required: true
  },
  secAnswer: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  IP: {
    type: String
  }
}, {
  toObject: {
    virtuals: true
  },
  timestamps: true,
  toJSON: {
    virtuals: true
  }
});

UserSchema.virtual('age')
.get(() => {
  let today = new Date(Date.now());
  let birth = new Date(this.birthday);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if(months < 0 || (months === 0 && days < 0)) {
    years = parseInt(years) - 1;
  }

  return years;
});

UserSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);