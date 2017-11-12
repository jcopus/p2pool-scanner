'use strict';

var util = require('util');
var async = require('async');

var digest = require('../digest/digest');
var geo = require('../digest/geo');

module.exports.probe = function(ip, port, cb) {
  var target = util.format('http://%s:%s', ip, port)
  var steps = [
    // local_stats
    function(done) {
      digest.localStats(target, done);
    },
    // global_stats
    function(done) {
      digest.globalStats(target, done);
    },
    // location
    function(done) {
      geo.location(ip, done);
    }
  ]

  async.series(steps, function(err, results) {
    if (err) {
      return cb(err);
    }

    // prune the unnecessary values from local_stats result
    var { miner_hash_rates, my_share_counts_in_last_hour,
      miner_dead_hash_rates, miner_hash_rates,
      shares, my_hash_rates_in_last_hour,
      miner_last_difficulties,
      ...localStats
     } = results[0];

    return cb(undefined, {
      'localStats': localStats,
      'globalStats': results[1], // global_stats
      'location': results[2] // location
    });
  });
}