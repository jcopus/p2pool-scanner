'use strict';

var geo = require('../digest/geo');
var expect = require('chai').expect;
var config = require('./testconfig');

describe('geo SDK tests', function() {
  describe('location', function() {
    it('should return the location with just a country', function(done) {
      geo.location(config.geo.countryIP, function(err, location) {
        if (err) {
          return done(err);
        }

        expect(location).to.not.be.undefined;
        expect(location).to.be.a('string');
        expect(location).to.equal('Luxembourg')
        return done();
      });
    });

    it('should return the location with country and city', function(done) {
      geo.location(config.geo.cityIP, function(err, location) {
        if (err) {
          return done(err);
        }

        expect(location).to.not.be.undefined;
        expect(location).to.be.a('string');
        expect(location).to.equal('Singapore, Singapore')
        return done();
      });
    });

    it('should fail because IP does not exist', function(done) {
      geo.location('badIP', function(err, location) {
        if (err) {
          return done();
        }

        return done(new Error('Expected the request to fail but it did not'));
      });
    });
  });
});