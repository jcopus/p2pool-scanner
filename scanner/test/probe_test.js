'use strict';

var tmp = require('tmp');
tmp.setGracefulCleanup();

var probe = require('../prober/probe').probe;
var ProbeManager = require('../prober/manager').ProbeManager;
var expect = require('chai').expect;
var config = require('./testconfig').prober;

describe('probe', function() {
  describe('probe', function() {
    it('should probe for all target information', function(done) {
      probe(config.success.ip, config.success.port, function(err, info) {
        if (err) {
          return done(err);
        }

        expect(info).to.not.be.undefined;
        expect(info.localStats).to.not.be.undefined;
        expect(info.localStats.miner_hash_rates).to.be.undefined;
        expect(info.globalStats).to.not.be.undefined;
        expect(info.location).to.equal('Luxembourg');

        return done();
      });
    });

    it('should fail because of a bad IP', function(done) {
      probe(config.failure.ip, config.failure.port, function(err, info) {
        if (err) {
          return done();
        }

        return done(new Error('should have failed but it did not'))
      });
    });
  });

  describe('manager', function() {
    it('should successfully process a list of nodes in series', function(done) {
      var pm = new ProbeManager(config.success.nodes, {});
      pm.update({}, function(err) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should successfully & concurrently process a list of nodes', function(done) {
      var pm = new ProbeManager(config.success.nodes, {});
      pm.update({concurrency: config.success.concurrency}, function(err) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should penalize failed node and ignore it until it works', function(done) {
        var pm = new ProbeManager(config.failure.nodes, {
          "failurePenalty": 1,
          "failurePenaltyThreshold": 3,
          "failureComeDown": 1
        });

        var ndx = 0;
        var limit = 6;

        function penaltyTestHelper (err) {
          if (err) {
            return done(err);
          }

          if (ndx < 2)
            expect(pm.failed[config.failure.nodes[0].ip].comedown).to.equal(false);
          else if (ndx >= 2 && ndx < 5)
            expect(pm.failed[config.failure.nodes[0].ip].comedown).to.equal(true);
          else
            expect(pm.failed[config.failure.nodes[0].ip]).to.be.undefined;

          if (++ndx === limit) {
            return done();
          } else {
            pm.update({}, penaltyTestHelper);
          }
        }

        pm.update({}, penaltyTestHelper);
    });

    it('should store the working node info on update', function(done) {
      var workingStorage = tmp.fileSync({
        postfix: '.json',
        mode: '0666'
      });

      var pm = new ProbeManager(config.storage.nodes, {
        workingStoragePath: workingStorage.name
      });

      pm.update({ storeOnUpdate: true }, function(err) {
        if (err) {
          return done(err);
        }

        try {
          var working = require(workingStorage.name)
          expect(working[0]).to.deep.equal(config.storage.nodes[0]);
        } catch(err) {
          return done(err);
        }

        return done();
      });
    });
  });
});