'use strict';

var request = require('request');
var util = require('util');

// JSDocs?
module.exports.localStats = function(target, cb) {
  request.get(
    util.format('%s/local_stats', target),
    function(err, res) {
      if (err) {
        return cb(err);
      }

      if (res.statusCode != 200) {
        return cb(new Error(
          util.format('local_stats: Received non-OK status code: %s - %s',
            res.statusCode,
            res.body)));
      }

      return cb(undefined,
        JSON.parse(res.body));
    }
  );
}

module.exports.fee = function(target, cb) {
  request.get(
    util.format('%s/fee', target),
    function(err, res) {
      if (err) {
        return cb(err);
      }

      if (res.statusCode != 200) {
        return cb(new Error(
          util.format('fee: Received non-OK status code: %s - %s',
            res.statusCode,
            res.body)));
      }

      return cb(undefined,
        JSON.parse(res.body));
    }
  );
}

module.exports.uptime = function(target, cb) {
  request.get(
    util.format('%s/uptime', target),
    function(err, res) {
      if (err) {
        return cb(err);
      }

      if (res.statusCode != 200) {
        return cb(new Error(
          util.format('uptime: Received non-OK status code: %s - %s',
            res.statusCode,
            res.body)));
      }

      return cb(undefined,
        JSON.parse(res.body));
    }
  );
}

module.exports.globalStats = function(target, cb) {
  request.get(
    util.format('%s/global_stats', target),
    function(err, res) {
      if (err) {
        return cb(err);
      }

      if (res.statusCode != 200) {
        return cb(new Error(
          util.format('global_stats: Received non-OK status code: %s - %s',
            res.statusCode,
            res.body)));
      }

      return cb(undefined,
        JSON.parse(res.body));
    }
  );
}