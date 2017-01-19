/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

//Requeires
const express = require('express');
const async = require('async');
const char = express.Router();

//Models
const UserSchema = require('../models/user.js');
const CharSchema = require('../models/char.js');
const ItemSchema = require('../models/item.js');
const RaceSchema = require('../models/race.js');
const SkillSchema = require('../models/skill.js');
const InventorySchema = require('../models/inventory.js');
const CharSkillsSchema = require('../models/charskills.js');

//Middlewares
const auth = require('../util/auth');

//Configurations
const classes = require('../config/classes');
const races = require('../config/races');
const levelExp = require('../config/level');
const levelStats = require('../config/stats');

char.use(auth.ensureAuthenticated);
char.post('/create', (req, res) => {
  let char = new CharSchema({
    name: req.body.name,
    class: req.body.class,
    race: req.body.race,
    account: req.user
  });

  char.save((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    req.session.char = char;

    return res.status(201).json({char: char});
  });
});

char.get('/select/:id', (req, res) => {
  let id = req.params.id;

  CharSchema.findOne({_id: id, account: req.user})
  .populate('equipment')
  .exec((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!char) return res.status(400).json({message: `Nonexistent character`});

    let stats = {
      STR: (char.stats) ? char.stats.STR : 0,
      VIT: (char.stats) ? char.stats.VIT : 0,
      INT: (char.stats) ? char.stats.INT : 0,
      AGI: (char.stats) ? char.stats.AGI : 0,
      DEX: (char.stats) ? char.stats.DEX : 0,
      LUK: (char.stats) ? char.stats.LUK : 0,
      statsPoints: (char.stats) ? char.stats.statsPoints : 0,

      Damage: 0,
      CriticalChance: 0,
      CriticalDamage: 0,

      Health: 0,
      Defense: 0,
      BlockChance: 0,
      DamageReduction: 0,
      MagicDamageReduction: 0,
      AllDamageReduction: 0,

      MagicDamage: 0,
      MagicCriticalChance: 0,
      MagicCriticalDamage: 0,

      Precise: 0,
      DoubleHitChance: 0,
      HealIncrease: 0,
      Evade: 0,
      PoisonChance: 0,
      CooldownReduction: 0 
    };

    let mStats = ["STR", "VIT", "INT", "AGI", "DEX", "LUK", "Health", "Defense", "Damage", "MagicDamage"];

    for(var index in classes[char.class].basicAttributes) {
      stats[index] += classes[char.class].basicAttributes[index];
    }

    for(var index in races[char.race].basicAttributes) {
      stats[index] += races[char.race].basicAttributes[index];
    }

    if(classes[char.class].pastClasses.length > 0){
      for(var i=0; i < classes[char.class].pastClasses.length; i++){
        let pastClass = classes[char.class].pastClasses[i];

        for(var index in classes[pastClass].basicAttributes) {
          stats[index] += classes[pastClass].basicAttributes[index];
        }

        for(var index in classes[pastClass].passives) {
          if(~mStats.indexOf(index)){
            let formula = (classes[pastClass].passives[index] + 100)/100;

            stats[index] = Math.round(stats[index] * formula);
          }else{
            stats[index] += classes[pastClass].passives[index];
          }
        }

      }
    }
    for(var i in char.equipment) {
      for(var index in char.equipment[i].stats){
        stats[index] += char.equipment[i].stats[index];
      }
    }

    for(var i in char.equipment) {
      for(var index in char.equipment[i].effect){
        if(~mStats.indexOf(index)){
          let formula = (char.equipment[i].effect[index] + 100)/100;

          stats[index] = Math.round(stats[index] * formula);
        }else{
          stats[index] += char.equipment[i].effect[index];
        }
      }
    }

    stats.Damage += stats.STR * 3;
    stats.BlockChance += Math.round(stats.STR / 5);
    stats.Health += stats.VIT * 40;
    stats.Defense += stats.VIT * 1.5;
    stats.MagicDamage += stats.INT * 3;
    stats.MagicCriticalChance += Math.round(stats.INT / 25);
    stats.Evade += Math.round(stats.AGI / 10);
    stats.CriticalChance += Math.round(stats.AGI / 25);

    if(classes[char.class].pastClasses.length > 0){
      for(var i=0; i < classes[char.class].pastClasses.length; i++){
        let pastClass = classes[char.class].pastClasses[i];

        for(var index in classes[pastClass].passives) {
          if(~mStats.indexOf(index)){
            let formula = (classes[pastClass].passives[index] + 100)/100;

            stats[index] = Math.round(stats[index] * formula);
          }else{
            stats[index] += classes[pastClass].passives[index];
          }
        }
      }
    }

    for(var index in classes[char.class].passives) {
      if(~mStats.indexOf(index)){
        let formula = (classes[char.class].passives[index] + 100)/100;

        stats[index] = Math.round(stats[index] * formula);
      }else{
        stats[index] += classes[char.class].passives[index];
      }
    }

    req.session.char = char;
    req.session.stats = stats;

    return res.status(201).json({char: char, stats: stats});
  });
});

char.get('/levelUp/:id', (req, res) => {
  let id = req.params.id;

  CharSchema.findOne({_id: id, account: req.user})
  .exec((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!char) return res.status(400).json({message: `Nonexistent character`});

    if(char.experience < levelExp[(char.level + 1)])
      return res.status(400).json({message: `This character dont have enough experience`});

    if((char.level == 20 || char.level == 40) && char.reborns <= 0)
      return res.status(400).json({message: `This character need to change class/reborn`});
    
    if(char.level == 50)
      return res.status(400).json({message: `This character need to reborn`});
    
    let newExperience = char.experience - levelExp[(char.level + 1)];
    let newLevel = char.level + 1;
    let newStats = char.stats.statsPoints + (levelStats[newLevel] * (char.reborns + 1));

    CharSchema.findOneAndUpdate({_id: id, account: req.user}, {level: newLevel, experience: newExperience, 'stats.statsPoints': newStats}, {new: true})
    .exec((err, char) => {
      if(err) return res.status(400).json({message: `Error ${err}`});

      if(!char) return res.status(400).json({message: `Nonexistent character`});

      res.status(201).json({message: `Char ${char._id} level uped`, char: char});
    });
  });
});

char.get('/changeClass/:id', (req, res) => {
  let id = req.params.id;

  CharSchema.findOne({_id: id, account: req.user})
  .exec((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!char) return res.status(400).json({message: `Nonexistent character`});

    if(char.level != 20 && char.level != 40)
      return res.status(400).json({message: `This character does not have the required level`});
    
    if(classes[char.class].nextClass === char.class)
      return res.status(400).json({message: `This character cant chage class`});

    let newClass = classes[char.class].nextClass;
    let newLevel = char.level + 1;

    CharSchema.findOneAndUpdate({_id: id, account: req.user}, {class: newClass, level: newLevel}, {new: true})
    .exec((err, char) => {
      if(err) return res.status(400).json({message: `Error ${err}`});

      if(!char) return res.status(400).json({message: `Nonexistent character`});

      res.status(201).json({message: `Char ${char._id} changed class`, char: char});
    });
  });
});

char.get('/reborn/:id', (req, res) => {
  let id = req.params.id;

  CharSchema.findOne({_id: id, account: req.user})
  .exec((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!char) return res.status(400).json({message: `Nonexistent character`});

    if(char.level < 41)
      return res.status(400).json({message: `This character does not have the required level`});
    
    if(char.reborns >= 5)
      return res.status(400).json({message: `You reached the maximum quantity of reborns`});
    
    let newRebonrs = char.reborns + 1;
    let newStats = char.stats.statsPoints + (char.level - 40);

    CharSchema.findOneAndUpdate({_id: id, account: req.user}, {reborns: newRebonrs, 'stats.statsPoints': newStats, level: 1}, {new: true})
    .exec((err, char) => {
      if(err) return res.status(400).json({message: `Error ${err}`});

      if(!char) return res.status(400).json({message: `Nonexistent character`});

      res.status(201).json({message: `Char ${char._id} reborned`, char: char});
    });
  });
});

char.post('/saveStats', (req, res) => {
  let id = req.body.id;
  let stats = JSON.parse(req.body.stats);

  CharSchema.findOne({_id: id, account: req.user})
  .exec((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!char) return res.status(400).json({message: `Nonexistent character`});

    if(stats.statsPoints != char.stats.statsPoints)
      return res.status(400).json({message: `Insfuccient points`});

    if(stats.STR === undefined || stats.VIT === undefined || stats.DEX === undefined ||
       stats.AGI === undefined || stats.INT === undefined || stats.LUK === undefined)
      return res.status(500).json({message: `Invalid object`});
    
    if((stats.STR + stats.VIT + stats.DEX + stats.AGI + stats.INT + stats.LUK) > stats.statsPoints)
      return res.status(500).json({message: `Invalid object`});

    char.stats.STR += stats.STR;
    char.stats.VIT += stats.VIT;
    char.stats.DEX += stats.DEX;
    char.stats.AGI += stats.AGI;
    char.stats.INT += stats.INT;
    char.stats.LUK += stats.LUK;
    char.stats.statsPoints -= (stats.STR + stats.VIT + stats.DEX + stats.AGI + stats.INT + stats.LUK);

    CharSchema.findOneAndUpdate({_id: id, account: req.user}, {stats: char.stats}, {new: true})
    .exec((err, char) => {
      if(err) return res.status(400).json({message: `Error ${err}`});

      if(!char) return res.status(400).json({message: `Nonexistent character`});

      res.status(201).json({message: `Status saved of ${char._id}`, char: char});
    });
  });
});

char.post('/saveEquipment', (req, res) => {
  let id = req.body.id;
  let equip = JSON.parse(req.body.equip);

  CharSchema.findOne({_id: id, account: req.user})
  .exec((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!char) return res.status(400).json({message: `Nonexistent character`});

    async.eachOfSeries(equip, (value, key, cb) => {
      if(value === null)
        return cb();

      InventorySchema.findOne({item: value, char: char._id})
      .exec((err, itens) => {
        if(err || !itens)
          return cb('invalid item');

        ItemSchema.findById(itens.item)
        .exec((err, item) => {
          if(err || !item)
            return cb('invalid item');
          
          key--;

          if(key < 0)
            key = 0;
          
          if(key != item.slot)
            return cb('invalid item');

          if(item.class != char.class)
            return cb('invalid item');

          if(char.level < item.level)
            return cb('invalid item');

          return cb();
        });
      });
    }, (err) => {
      if(err)
        return res.status(400).json({message: `Object invalid`});
      
      CharSchema.findOneAndUpdate({_id: id, account: req.user}, {equipment: equip}, {new: true})
      .exec((err, char) => {
        if(err) return res.status(400).json({message: `Error ${err}`});

        if(!char) return res.status(400).json({message: `Nonexistent character`});

        res.status(201).json({message: `Equipment saved of ${char._id}`, char: char});
      });
    });
  });
});

char.post('/addItem', (req, res) => {
  let id = req.body.id;
  let itens = JSON.parse(req.body.itens);

  CharSchema.findOne({_id: id, account: req.user})
  .exec((err, char) => {
    if(err) return res.status(400).json({message: `Error ${err}`});

    if(!char) return res.status(400).json({message: `Nonexistent character`});

    async.eachOfSeries(itens, (value, key, cb) => {
      if(value === null)
        return cb();

      InventorySchema.count({})
      .exec((err, c) => {
        InventorySchema.findOne({item: value, char: char._id})
        .exec((err, item) => {
          ItemSchema.findById(itens.item)
          .exec((err, item) => {
            if(err || !item)
              return cb('invalid item');

            if(err)
              return cb('invalid item');
            
            if(!item){
              let newItem = new InventorySchema({
                item: value,
                slot: c+1,
                char: char._id
              });
              newItem.save((err, i) => {
                if(err)
                  return cb(err);
                return cb();
              });
            }

            if(item){
              let newQuantity = item.quantity + 1;            
              InventorySchema.findOneAndUpdate({item: value, char: char._id}, {quantity: newQuantity})
              .exec((err, i) => {
                if(err)
                  return cb(err);
                return cb();
              });
            }
          });
        });
      });
    }, (err) => {
      if(err)
        return res.status(400).json({message: `Object invalid`});
      
      return res.status(201).json({message: `Itens added on ${char._id}`});
    });
  });
});

module.exports = char;