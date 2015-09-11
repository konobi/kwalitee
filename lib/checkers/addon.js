
var async = require('async');
var path = require('path');
var fs = require('fs');

function AddonChecker (path, _test_pkg_json) {
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

AddonChecker.prototype.name = "addon_checker";

AddonChecker.prototype.score = function score (cb) {
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
      var check_path = path.resolve(path.join(self.path, 'binding.gyp'));
      fs.stat( check_path, function(err, stat) {
        self.data.is_addon = (!err && stat && stat.isFile()) ? true : false;
        $cb();
      });
    }
  ], function(err) {

    if(self.data.is_addon === false) {
      return cb(ret);
    }

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
   `npm init` will fill in a default test script that ends with "&& exit 1". We want to
   make sure that it's not that.
*/
AddonChecker.prototype._score_addon_depends_on_nan_and_bindings = function() {
  var self = this;

  var ret_score = 0;
  if(self.package_json.dependencies
      && typeof self.package_json.dependencies === 'object'){

    if('nan' in self.package_json.dependencies) {
      ret_score += 2.0;
    }
    if('bindings' in self.package_json.dependencies) {
      ret_score += 2.0;
    }
  }

  return [ ret_score, 4.0 ];
}

module.exports = AddonChecker;