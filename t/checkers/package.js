
var tap = require('tap');
var async = require('async');

var PackageChecker = require('../../lib/checkers/package');

tap.test('basic functionality', function(t) {
  t.type(PackageChecker, 'function', "Ensure checker is function");

  var obj = new PackageChecker('../../t/checkers/package/with-node-in-name.json');
  t.type(obj, 'object', "PackageChecker is a constructor");

  var obj2 = new PackageChecker('../../t/checkers/package/test-dir');
  t.type(obj, 'object', "Uses package.json in directory when available");

  t.done();
});

tap.test('package does not include name', function(t) {

  async.series([
    function(cb){

      var obj = new PackageChecker('../../t/checkers/package/with-node-in-name.json');
      obj.score(function(score) {
        t.equals(score.scores.packagename_does_not_include_node[0], 0.0, 
            'Correct scoring for package with node in name');
        t.equals(score.scores.packagename_does_not_include_node[1], 1.0, 
            'Correct possible score for package with node in name');
        cb();
      });
    },
    function(cb){

      var obj2 = new PackageChecker('../../t/checkers/package/without-node-in-name.json');
      obj2.score(function(score) {
        t.equals(score.scores.packagename_does_not_include_node[0], 1.0, 
            'Correct scoring for package without node in name');
        t.equals(score.scores.packagename_does_not_include_node[1], 1.0, 
            'Correct possible score for package without node in name');
        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

tap.test('package has repo', function(t) {

  async.series([
    function(cb){

      var obj = new PackageChecker('../../t/checkers/package/without-repo.json');
      obj.score(function(score) {
        t.equals(score.scores.package_has_repo[0], 0.0, 
            'Correct scoring for package without repo');
        t.equals(score.scores.package_has_repo[1], 1.0, 
            'Correct possible score for package without repo');
        cb();
      });
    },
    function(cb){

      var obj2 = new PackageChecker('../../t/checkers/package/with-repo.json');
      obj2.score(function(score) {
        t.equals(score.scores.package_has_repo[0], 1.0, 
            'Correct scoring for package with repo');
        t.equals(score.scores.package_has_repo[1], 1.0, 
            'Correct possible score for package with repo');
        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

tap.test('package has sufficient description', function(t) {

  async.series([
    function(cb){

      var obj = new PackageChecker('../../t/checkers/package/without-sufficient-description.json');
      obj.score(function(score) {
        t.equals(score.scores.package_has_sufficient_description[0], 0.0, 
            'Correct scoring for package without repo');
        t.equals(score.scores.package_has_sufficient_description[1], 2.0, 
            'Correct possible score for package without repo');
        cb();
      });
    },
    function(cb){

      var obj2 = new PackageChecker('../../t/checkers/package/with-sufficient-description.json');
      obj2.score(function(score) {
        t.equals(score.scores.package_has_sufficient_description[0], 2.0, 
            'Correct scoring for package with repo');
        t.equals(score.scores.package_has_sufficient_description[1], 2.0, 
            'Correct possible score for package with repo');
        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

tap.test('package has spdx licensing', function(t) {

  async.series([
    function(cb){

      var obj = new PackageChecker('../../t/checkers/package/without-spdx-license.json');
      obj.score(function(score) {
        t.equals(score.scores.package_has_spdx_license[0], 0.0, 
            'Correct scoring for package without spdx license');
        t.equals(score.scores.package_has_spdx_license[1], 4.0, 
            'Correct possible score for package without spdx license');
        cb();
      });
    },
    function(cb){

      var obj2 = new PackageChecker('../../t/checkers/package/with-spdx-not-osi-license.json');
      obj2.score(function(score) {
        t.equals(score.scores.package_has_spdx_license[0], 3.0, 
            'Correct scoring for package with spdx license (non-osi-approved)');
        cb();
      });
    },
    function(cb) {
      var obj3 = new PackageChecker('../../t/checkers/package/with-spdx-osi-license.json');
      obj3.score(function(score) {
        t.equals(score.scores.package_has_spdx_license[0], 4.0, 
            'Correct scoring for package with spdx license (osi-approved)');
        cb();
      });

    }
  ], function(err) {
    t.done();
  });

});

