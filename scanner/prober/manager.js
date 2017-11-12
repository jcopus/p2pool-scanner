'use strict';

var util = require('util');
var async = require('async');
var fs = require('fs');
var join = require('path').join;

var probe = require('./probe').probe;

module.exports.ProbeManager = ProbeManager;

function ProbeManager(nodes, options) {
  this.nodes = nodes;
  this.failed = {};

  this.failurePenalty = options.failurePenalty ? options.failurePenalty : 2;
  this.failurePenaltyThreshold = options.failurePenaltyThreshold ? options.failurePenaltyThreshold : 10;
  this.failureComeDown = options.failureComedown ? options.failureComedown : 1;
  this.debug = options.debug;
  this.workingStoragePath = options.workingStoragePath ? options.workingStoragePath : join(process.cwd(), 'working-nodes.json');
}

ProbeManager.prototype.update = function(options, cb) {
  var limit = options && options.concurrency ? options.concurrency : 1;
  var instance = this;

  var q = async.queue(function(node, done) {
    probe(node.ip, node.port, function(err, info) {
      if (err) {
        return done(err);
      }

      return done(undefined, info);
    });
  }, limit);

  q.drain = function() {
    // flush working list
    if (options.storeOnUpdate) {
        return instance.storeWorking(cb)
    }

    return cb();
  }

  instance.nodes.forEach(function(node) {
    // check if it is coming down from failure
    if (instance.failed[node.ip] && instance.failed[node.ip].comedown) {
      // come down from failure threshold
      instance.failed[node.ip].penalty -= instance.failureComeDown;

      if (instance.failed[node.ip].penalty <= 0) {
        // remove it from failed list if its come all the way down
        delete instance.failed[node.ip];
      }

      return;
    }

    // enqueue node to be probed
    q.push(node, function(err, info) {
      if (err) {
        instance.penalizeNode(node);
        return;
      }

      // looks like it passed, so remove it from failed list
      if (instance.failed[node.ip]) {
        delete instance.failed[node.ip]
      }

      return;
    });
  });

  // the queue should only be idle if there are no valid nodes to queue in the entire list
  if (q.idle()) {
    return cb();
  }
}

ProbeManager.prototype.penalizeNode = function(node) {
  if (this.failed[node.ip]) {
    this.failed[node.ip].penalty += this.failurePenalty;
    this.failed[node.ip].comedown = this.failed[node.ip].penalty >= this.failurePenaltyThreshold;
  } else {
    this.failed[node.ip] = {
      "penalty": this.failurePenalty,
      "comedown": false
    }
  }
};

ProbeManager.prototype.storeWorking = function(cb) {
  var instance = this;

  var working = instance.nodes.filter(function(node) {
    return instance.failed[node.ip] === undefined
  });

  fs.writeFile(instance.workingStoragePath, JSON.stringify(working), cb)
}