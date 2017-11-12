'use strict';

var digest = require('../digest/digest');
var expect = require('chai').expect;
var config = require('./testconfig');

describe('digest SDK tests', function() {
  describe('local_stats', function() {
    it('should return the local stats', function(done) {
      digest.localStats(config.target, function(err, stats) {
        if (err) {
          return done(err);
        }

        expect(stats).to.not.be.undefined;
        return done();
      });
    });

    it('should fail because of a bad IP', function(done) {
      digest.localStats('badip', function(err, stats) {
        if (err) {
          return done();
        }

        return done(new Error('did not fail because of a bad IP when it should have'));
      });
    });
  });

  describe('fee', function() {
    it('should return the fee', function(done) {
      digest.fee(config.target, function(err, fee) {
        if (err) {
          return done(err);
        }

        expect(fee).to.not.be.undefined;
        return done();
      });
    });

    it('should fail because of a bad IP', function(done) {
      digest.fee('badip', function(err, fee) {
        if (err) {
          return done();
        }

        return done(new Error('did not fail because of a bad IP when it should have'));
      });
    });
  });

  describe('uptime', function() {
    it('should return the uptime', function(done) {
      digest.uptime(config.target, function(err, uptime) {
        if (err) {
          return done(err);
        }

        expect(uptime).to.not.be.undefined;
        return done();
      });
    });

    it('should fail because of a bad IP', function(done) {
      digest.uptime('badip', function(err, uptime) {
        if (err) {
          return done();
        }

        return done(new Error('did not fail because of a bad IP when it should have'));
      });
    });
  });

  describe('global_stats', function() {
    it('should return the globalStats', function(done) {
      digest.globalStats(config.target, function(err, globalStats) {
        if (err) {
          return done(err);
        }

        expect(globalStats).to.not.be.undefined;
        return done();
      });
    });

    it('should fail because of a bad IP', function(done) {
      digest.globalStats('badip', function(err, globalStats) {
        if (err) {
          return done();
        }

        return done(new Error('did not fail because of a bad IP when it should have'));
      });
    });
  });
});