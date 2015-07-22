/*
 * start-stop-json-test.js: start or stop forever using relative paths, the script path could be start with './', '../' ...
 *
 * (C) 2010 Charlie Robbins & the Contributors
 * MIT LICENCE
 *
 */

var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    vows = require('vows'),
    forever = require('../../lib/forever');

function runCmd(cmd, args) {
  var proc = spawn(process.execPath, [
    path.resolve(__dirname, '../../', 'bin/forever'),
    cmd
  ].concat(args), {detached: true});

  proc.unref();
}

vows.describe('forever/core/start-stop-json').addBatch({
  "When using forever" : {
    "to start process using JSON configuration file" : {
      topic: function () {
        runCmd('start', [
          './test/fixtures/server.json'
        ]);
        setTimeout(function (that) {
          forever.list(false, that.callback);
        }, 2000, this);
      },
      "the startup should works fine": function (err, procs) {
        assert.isNull(err);
        assert.isArray(procs);
        assert.equal(procs.length, 1);
      }
    }
  }
}).addBatch({
    "When the script is running" : {
      "try to stop by name" : {
        topic: function () {
          runCmd('stop', [
            'server'
          ]);
          setTimeout(function (that) {
            forever.list(false, that.callback);
          }, 2000, this);
        },
        "the shut down should works fine": function (err, procs) {
          assert.isNull(err);
          assert.isNull(procs);
        }
      }
    }
  }).export(module);
