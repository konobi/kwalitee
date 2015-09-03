
var tap = require('tap');
var kwalitee = require('../lib/index.js');

var check = new kwalitee({ path: '../../t/data/basic-operation/' });

check.init(function() {
  check.score(function (scores) {
    tap.equals(scores.overall.total, 22.0, 'got the correct overall');
  });
});

