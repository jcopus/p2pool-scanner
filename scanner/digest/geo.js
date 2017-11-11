'use strict';

var request = require('request');
var util = require('util');

module.exports.location = function(ip, cb) {
  request.get(
    util.format('http://freegeoip.net/json/%s', ip),
    function(err, res) {
      if (err) {
        return cb(err);
      }

      if (res.statusCode != 200) {
        return cb(util.format('location: Received non-OK status code: %s - %s',
            res.statusCode,
            res.body));
      }

      var jsonBody = JSON.parse(res.body);
      var locationString = jsonBody.city ? util.format('%s, %s', jsonBody.city, jsonBody.country_name) : jsonBody.country_name;

      return cb(undefined, locationString)
    }
  );
}