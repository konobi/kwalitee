var spdx = require('spdx-licenses');

function PackageChecker (path) {
  var self = this;

  self.path = path;

  // for easiser testing
  if(path.match(/\.json$/)){
    self.package_json = require(path);
  } else {
    self.package_json = require(path + '/package.json');
  }

  return this;
}

PackageChecker.prototype.name = "package_checker";

PackageChecker.prototype.score = function score (cb) {
  var self = this;
 
  var ret = {
    overall: { score: 0, total: 0},
    scores: {}
  };

  var score = self._score_packagename_does_not_include_node();
  ret.overall.score += score[0];
  ret.overall.total += score[1];
  ret.scores['packagename_does_not_include_node'] = score;

  score = self._score_package_has_repo();
  ret.overall.score += score[0];
  ret.overall.total += score[1];
  ret.scores['package_has_repo'] = score;

  score = self._score_package_has_sufficient_description();
  ret.overall.score += score[0];
  ret.overall.total += score[1];
  ret.scores['package_has_sufficient_description'] = score;

  score = self._score_package_has_spdx_license();
  ret.overall.score += score[0];
  ret.overall.total += score[1];
  ret.scores['package_has_spdx_license'] = score;

  cb(ret);  
};

/*
   There are lots of packages out there with "node-" or "-node" as a component of the
   package name. This is redundant though. The name of a git repo shouldn't influence
   the package name.
*/
PackageChecker.prototype._score_packagename_does_not_include_node = function () {
  var self = this;

  if(!self.package_json.name.match(/(?:^node-|-node$)/)) {
    return [ 1.0, 1.0 ];
  } else {
    return [ 0.0, 1.0 ];
  }
}

/*
   Should have a repo defined.
   XXX - We should also add additional tests to check for validity of repo location
   and it's availability over time (repo rename, organization moves, etc.
*/
PackageChecker.prototype._score_package_has_repo = function () {
  var self = this;

  if(!self.package_json.repo) {
    return [ 0.0, 1.0 ];
  } else {
    return [ 1.0, 1.0 ];
  }
}

/*
   The description should be verbose about the purpose of the package
   XXX - This is currently arbitraryly set at 30 characters length. A better
   method to define the readability would be next.
*/
PackageChecker.prototype._score_package_has_sufficient_description = function () {
  var self = this;

  if(!self.package_json.desc || self.package_json.desc.length < 30) {
    return [ 0.0, 2.0 ];
  } else {
    return [ 2.0, 2.0 ];
  }
}

/*
   The package should have an spdx registered licence. We give extra
   credence to licences that are OSI approved.
*/
PackageChecker.prototype._score_package_has_spdx_license = function () {
  var self = this;

  if(self.package_json.license) {
    var score = 0.0;
    var info = spdx.spdx(self.package_json.license);
    if(info) {
      score = score + 3.0;
      if(info.OSIApproved) {
        score =  score + 1.0;
      }
    }

    return [ score, 4.0 ];
  } else {
    return [ 0.0, 4.0 ];
  }
}

module.exports = PackageChecker;
