var async = require('async');
var path = require('path');
var fs = require('fs');
var util = require('util');
var basechecker = require('../base');

function TestsChecker (path, _test_pkg_json) {
  var self = this;

  basechecker.call(this);

  self.path = path;
  self.data = {};

  self.package_json = require(path + '/package.json');

  // Purely for easier testing
  if(typeof _test_pkg_json === 'object') {
    self.package_json = _test_pkg_json;
  }

  return self;
}
util.inherits(TestsChecker, basechecker);

TestsChecker.prototype.name = "tests_checker";

TestsChecker.prototype.score = function score (cb) {
  var self = this;
 
  var ret = {
    overall: { score: 0, total: 0},
    scores: {}
  };

  var score_test_funcs = self.get_score_test_names(); 

  var testDir = 'test';
  self.data.package_json_has_directories_test = false;
  
  if (self.package_json.directories && self.package_json.directories.test) {
    testDir = self.package_json.directories.test;
    self.data.package_json_has_directories_test = true;
  }
  
  async.series([
    function check_for_test_directory ($cb) {
      var check_path = path.join(self.path, testDir);
      fs.stat( check_path, function(err, stat) {
        self.data.has_test_directory = (!err && stat && stat.isDirectory()) ? true : false;
        $cb();
      });
    }
  ], function(err) {
    cb(self.gather_scores(ret));
  });

};

/*
  We should have a key in package.json pointing to the directory our tests are in.
*/
TestsChecker.prototype._score_package_json_has_directories_test = function () {
  var self = this;
  
  if (self.data.package_json_has_directories_test === true) {
    return [ 10.0, 10.0 ];
  }
  
  return [ 0.0, 10.0 ];
};

/*
  We should have a folder containing tests. Based on input from community and npm,
  this has been decided as "test"
*/
TestsChecker.prototype._score_test_folder_exists = function () {
  var self = this;

  if(self.data.has_test_directory) {
    return [ 10.0, 10.0 ];
  }

  return [ 0.0, 10.0 ];
};

/*
   `npm init` will fill in a default test script that ends with "&& exit 1". We want to
   make sure that it's not that.
*/
TestsChecker.prototype._score_test_script_is_not_default = function() {
  var self = this;

  if(self.package_json.scripts
      && typeof self.package_json.scripts === 'object'
      && self.package_json.scripts.test
      && typeof self.package_json.scripts.test === 'string'
      && !self.package_json.scripts.test.match(/&& exit 1\s*?$/) )
  {
    return [ 10.0, 10.0 ];
  }

  return [ 0.0, 10.0 ];
};

module.exports = TestsChecker;
