
var tap = require('tap');

var PackageChecker = require('../../lib/checkers/package');

tap.test('basic functionality', function(t) {
  t.type(PackageChecker, 'function', "Ensure checker is function");

  
});
