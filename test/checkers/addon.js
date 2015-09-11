var tap = require('tap');
var async = require('async');
var path = require('path');

var AddonChecker = require('../../lib/checkers/addon');
var fake_path = path.join(__dirname, 'addon/test-dir/')
function reset () {
  delete require.cache[ path.resolve(fake_path) ];
}
function fresh (stuff ) {
  reset();

  return new AddonChecker(fake_path, stuff);
}

tap.test('basic functionality', function(t) {
  t.type(AddonChecker, 'function', "Ensure checker is function");

  var obj = new AddonChecker(fake_path);
  t.type(obj, 'object', "AddonTestsChecker is a constructor");
  reset();

  var obj2 = new AddonChecker(fake_path);
  t.type(obj2, 'object', "Uses package.json in directory when available");
  reset();

  t.done();
});

tap.test('Addon requires nan and bindings as dependencies', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: 'addon-without-dependencies'
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.addon_depends_on_nan_and_bindings[0], 0.0, 
            'Correct scoring for addon without dependencies');
        t.equals( s.addon_depends_on_nan_and_bindings[1], 4.0, 
            'Correct possible score for addon with dependencies');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: 'addon-with-dependencies',
        dependencies: {
          "nan": "1.2.3",
          "bindings": "4.5.6"
        }
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.addon_depends_on_nan_and_bindings[0], 4.0, 
            'Correct scoring for addon with dependencies');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: 'addon-with-only-one-dependency',
        dependencies: {
          "nan": "1.2.3",
        }
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.addon_depends_on_nan_and_bindings[0], 2.0, 
            'Correct scoring for addon with one dependency');

        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

tap.test('Addon requires node-gyp as devdependency', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: 'addon-without-devdependencies'
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.addon_depends_on_nodegyp_devdependency[0], 0.0, 
            'Correct scoring for addon without devdependencies');
        t.equals( s.addon_depends_on_nodegyp_devdependency[1], 3.0, 
            'Correct possible score for addon with node-gyp devdependency');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: 'addon-with-nodegyp-devdependency',
        devDependencies: {
          "node-gyp": "2.4.6"
        }
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.addon_depends_on_nodegyp_devdependency[0], 3.0, 
            'Correct scoring for addon with node-gyp devdependency');

        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

