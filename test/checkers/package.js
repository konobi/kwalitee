
var tap = require('tap');
var async = require('async');
var path = require('path');

var PackageChecker = require('../../lib/checkers/package');
var fake_path = '../../test/checkers/package/test-dir/';
function reset () {
  delete require.cache[ path.resolve(fake_path) ];
}
function fresh (stuff) {
  reset();
  return new PackageChecker(fake_path, stuff);
}

tap.test('basic functionality', function(t) {
  t.type(PackageChecker, 'function', "Ensure checker is function");

  var obj = new PackageChecker(fake_path);
  t.type(obj, 'object', "PackageChecker is a constructor");
  reset();

  var obj2 = new PackageChecker(fake_path);
  t.type(obj2, 'object', "Uses package.json in directory when available");
  reset();

  t.done();
});

tap.test('package does not include name', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: 'node-this-should-fail'   
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.packagename_does_not_include_node[0], 0.0, 
            'Correct scoring for package with node in name');
        t.equals( s.packagename_does_not_include_node[1], 1.0, 
            'Correct possible score for package with node in name');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: 'this-is-okay-as-a-name'
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.packagename_does_not_include_node[0], 1.0, 
            'Correct scoring for package without node in name');

        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

tap.test('package does not include "js" in name', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: 'this-should-fail-js'
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.packagename_does_not_include_js[0], 0.0, 
            'Correct scoring for package with "js" in name');
        t.equals( s.packagename_does_not_include_js[1], 1.0, 
            'Correct possible score for package with "js" in name');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: 'this-is-okay-as-a-name'
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals( s.packagename_does_not_include_js[0], 1.0, 
            'Correct scoring for package without "js" in name');

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
      var obj = fresh({
        name: "without-repo"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_repo[0], 0.0, 
            'Correct scoring for package without repo');
        t.equals(s.package_has_repo[1], 1.0, 
            'Correct possible score for package without repo');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: "with-repo",
        repository: "repoexists"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_repo[0], 1.0, 
            'Correct scoring for package with repo');

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
      var obj = fresh({
        name: "without-sufficient-description",
        description: "yeah no"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_sufficient_description[0], 0.0, 
            'Correct scoring for package without repo');
        t.equals(s.package_has_sufficient_description[1], 2.0, 
            'Correct possible score for package without repo');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: 'is-sufficient-description',
        description: "This is an exmaple of a descritpion which is sufficient for kwalitee"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_sufficient_description[0], 2.0, 
            'Correct scoring for package with repo');

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
      var obj = fresh({
        name: "without-spdx-license",
        license: "MegaCorpLicense"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_spdx_license[0], 0.0, 
            'Correct scoring for package without spdx license');
        t.equals(s.package_has_spdx_license[1], 4.0, 
            'Correct possible score for package without spdx license');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: "spdx-non-osi-license",
        license: "YPL-1.0"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_spdx_license[0], 3.0, 
            'Correct scoring for package with spdx license (non-osi-approved)');

        cb();
      });
    },
    function(cb) {
      var obj = fresh({
        name: "valid-spdx-osi",
        license: "MIT"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_spdx_license[0], 4.0, 
            'Correct scoring for package with spdx license (osi-approved)');
        
        cb();
      });
    }
  ], function(err) {
    t.done();
  });

});

tap.test('package has valid semver', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: "not-valid-semver",
        version: "ahahahaha"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_valid_semver[0], 0.0, 
            'Correct scoring for package without valid semver');
        t.equals(s.package_has_valid_semver[1], 6.0, 
            'Correct possible score for package without valid semver');
        
        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: "valid-semver",
        version: "1.2.3"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_valid_semver[0], 6.0, 
            'Correct scoring for package with valid semver');
        
        cb();
      });
    },
  ], function(err) {
    t.done();
  });

});

tap.test('package uses semver of 1.0.0 or above', function(t) {
  async.series([
    function(cb){
      var obj = fresh({
        name: "valid-semver-not-1.0.0-or-over",
        version: "0.2.3"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_valid_semver_with_base_value[0], 0.0, 
            'Correct scoring for package without valid semver');
        t.equals(s.package_has_valid_semver_with_base_value[1], 3.0, 
            'Correct possible score for package without valid semver');
        
        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: "valid-semver-over-1.0.0",
        version: "1.2.3"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_valid_semver_with_base_value[0], 3.0, 
            'Correct scoring for package with valid semver');
        
        cb();
      });
    },
  ], function(err) {
    t.done();
  });
});

tap.test('package has minimum keywords', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: "without-minimum-keywords",
        keywords: [ 'just-one' ]
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_minimum_keywords[0], 0.0, 
            'Correct scoring for package without minimum keywords');
        t.equals(s.package_has_minimum_keywords[1], 2.0, 
            'Correct possible score for package without minimum keywords');
        
        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: "with-minimum-keywords",
        keywords: [ "one", "two", "three", "more" ]
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_minimum_keywords[0], 2.0, 
            'Correct scoring for package with minimum keywords');
        
        cb();
      });
    },
  ], function(err) {
    t.done();
  });

});

tap.test('package has author', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: "no-author"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_author[0], 0.0, 
            'Correct scoring for package without author');
        t.equals(s.package_has_author[1], 1.0, 
            'Correct possible score for package without author');

        cb();
      });
    },
    function(cb){
      var obj = fresh({
        name: "with-author",
        author: {
          name: "A. Uthor"
        }
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_author[0], 1.0, 
            'Correct scoring for package with author');

        cb();
      });
    },
  ], function(err) {
    t.done();
  });

});

tap.test('package has test script', function(t) {

  async.series([
    function(cb){
      var obj = fresh({
        name: "without-test-script"
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_test_script[0], 0.0, 
            'Correct scoring for package without test script');
        t.equals(s.package_has_test_script[1], 5.0, 
            'Correct possible score for package without test script');

        cb();
      });
    },
    function(cb){

      var obj = fresh({
        name: "with-test-script",
        scripts: {
          test: "echo 'we have some sort of test script here'"
        }
      });
      obj.score(function(score) {
        var s = score.scores;
        t.equals(s.package_has_test_script[0], 5.0, 
            'Correct scoring for package with test script');

        cb();
      });
    },
  ], function(err) {
    t.done();
  });

});

