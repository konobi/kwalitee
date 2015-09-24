var tap = require('tap');
var async = require('async');
var path = require('path');

var TestsChecker = require('../../lib/checkers/tests');
var fake_path = '../../test/checkers/tests/test-dir/';
function reset () {
  delete require.cache[ path.resolve(fake_path) ];
}
function fresh (stuff, test_path) {
  reset();

  var path_to_use = test_path 
    ? path.join(__dirname, 'tests/', test_path) 
    : fake_path;
  
  return new TestsChecker(path_to_use, stuff);
}

tap.test('basic functionality', function(t) {
  t.type(TestsChecker, 'function', "Ensure checker is function");

  var obj = new TestsChecker(fake_path);
  t.type(obj, 'object', "TestsChecker is a constructor");
  reset();

  var obj2 = new TestsChecker(fake_path);
  t.type(obj2, 'object', "Uses package.json in directory when available");
  reset();

  t.done();
});

tap.test('test folder exists', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: 'test-folder-does-not-exist'
      }, "test-folder-does-not-exist");
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.test_folder_exists[0], 0.0, 
            'Correct scoring for package without test folder');
        t.equals( s.test_folder_exists[1], 10.0, 
            'Correct possible score for package without test folder');
        t.equals( s.package_json_has_directories_test[0], 0.0,
            'Correct scoring for package without package.json directories.tests');
        t.equals( s.package_json_has_directories_test[1], 10.0, 
            'Correct possible score for package with package.json directories.tests, no matching folder');
        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: 'test-folder-does-exist'
      }, 'test-folder-does-exist');
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.test_folder_exists[0], 10.0, 
            'Correct scoring for package with test folder');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        directories:{ test: 'foo' }
      }, "test-folder-does-not-exist-with-pjson");
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.package_json_has_directories_test[0], 10.0, 
            'Correct scoring for package with package.json directories.tests, no matching folder');
        t.equals( s.test_folder_exists[0], 0.0,
            'Correct scoring for package without test folder');
        cb();
      });
    },
    function(cb){
      var obj = fresh({
        directories:{ test: 'foo' }
      }, "test-folder-does-exist-with-pjson");
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.package_json_has_directories_test[0], 10.0, 
            'Correct scoring for package with package.json directories.tests, no matching folder');
        t.equals( s.test_folder_exists[0], 10.0,
            'Correct scoring for package with test folder');
        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

tap.test('test script is not default', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: 'test-is-default',
        scripts: {
          "test": "echo 'bad author, no default' && exit 1"
        }
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.test_script_is_not_default[0], 0.0, 
            'Correct scoring for default test script');
        t.equals( s.test_script_is_not_default[1], 10.0, 
            'Correct possible score for non default test script');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: 'test-is-not-default',
        scripts: {
          "test": "echo 'not the default test'"
        }
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.test_script_is_not_default[0], 10.0, 
            'Correct scoring for non default test script');

        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

