
var fs = require('fs');
var path = require('path');

function Package (opts) {
  var self = this;

  self.path = opts.path;
  self.checkers = opts.checkers;

  return self;
}

Package.prototype.init = function init (cb) {
  var self = this;

  if(self.initialized) cb();

  self.initialized = true;

  if(self.checkers){
    fs.readdir(path.dirname(module.filename) + '/checkers/', function(err, files) {
      var names = files.filter(function(item){
        return item.match(/\.js$/);
      });
      self.checks = check_names_to_modules(names);
      cb();
    });
  } else {
    self.checks = check_names_to_modules(self.checkers);
    cb();
  }

};

function checker_names_to_modules (names) {
  var mapping = {};

  names.forEach(function(item){ 
    var checker_module = require('./checkers/' + name);
    mapping[item] = checker_module;
  });
  
  return mapping;
}

Package.prototype.dump_checkers = function dump_checkers () {
  var self = this;

  console.log(self.checks);
}

module.exports = Package;
