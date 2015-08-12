
function PackageChecker (path) {
  var self = this;

  self.path = path;
  self.package_json = require(path + '/package.json');

  return this;
}

PackageChecker.prototype.score = function score (cb) {
  var self = this;
  
  var score = self._score_packagename_does_not_include_node();
  cb(score);  
};

/*
    There are lots of packages out there with "node-" or "-node" as a component of the
    package name. This is redundant though. The name of a git repo shouldn't influence
    the package name.
 */
PackageChecker.prototype._score_packagename_does_not_include_node = function () {
  var self = this;

  if(self.package_json.name !~ /(?:^node-|-node$)/) {
    return [ 1.0, 1.0 ];
  } else {
    return [ 0.0, 1.0 ];
  }
}

module.exports = PackageChecker;
