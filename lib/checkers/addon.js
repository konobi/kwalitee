
var async = require('async');
var path = require('path');
var fs = require('fs');
var util = require('util');
var basechecker = require('../base');

function AddonChecker (path, _test_pkg_json) {
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
util.inherits(AddonChecker, basechecker);

AddonChecker.prototype.name = "addon_checker";

AddonChecker.prototype.score = function score (cb) {
  var self = this;
 
  var ret = {
    overall: { score: 0, total: 0},
    scores: {}
  };

  var score_test_funcs = self.get_score_test_names();

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

    cb(self.gather_scores(ret));
  });

};


AddonChecker.prototype._score_addon_depends_on_nodegyp_devdependency = function() {
  var self = this;

  var ret_score = 0;
  if(self.package_json.devDependencies
      && typeof self.package_json.devDependencies === 'object'){

    if('node-gyp' in self.package_json.devDependencies) {
      ret_score = 3.0;
    }
  }

  return [ ret_score, 3.0 ];
}

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
