var async = require('async');
var path = require('path');
var fs = require('fs');

function TestsChecker (path, _test_pkg_json) {
  var self = this;

  self.path = path;
  self.data = {};

  self.package_json = require(path + '/package.json');

  // Purely for easier testing
  if(typeof _test_pkg_json === 'object') {
    self.package_json = _test_pkg_json;
  }

  return self;
}

TestsChecker.prototype.name = "tests_checker";

TestsChecker.prototype.score = function score (cb) {
  var self = this;
 
  var ret = {
    overall: { score: 0, total: 0},
    scores: {}
  };

  var score_test_funcs = Object.getOwnPropertyNames(self.__proto__).filter(function(value) {
    if(value.match('^_score_') ){
      return true;
    }
    return false;
  });

  async.series([
    function check_for_test_directory ($cb) {
      var check_path = path.join(self.path, 'test');
      fs.stat( check_path, function(err, stat) {
        self.data.has_test_directory = (!err && stat && stat.isDirectory()) ? true : false;
        $cb();
      });
    }
  ], function(err) {
    score_test_funcs.forEach(function(test_function) {
      var score = self[test_function]();
      ret.overall.score += score[0];
      ret.overall.total += score[1];
      var test_name = test_function.replace(/^_score_/, '');
      ret.scores[test_name] = score;
    });

    cb(ret);  
  });

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
}

module.exports = TestsChecker;
