
var fs = require('fs');
var path = require('path');
var async = require('async');

function Package (opts) {
  var self = this;

  self.path = opts.path;
  self.checkers = opts.checkers || [];
  self.checks = [];

  return self;
}

Package.prototype.init = function init (cb) {
  var self = this;

  if(self.checkers.length <= 0){
    fs.readdir(path.dirname(module.filename) + '/checkers/', function(err, files) {
      var names = files.filter(function(item){
        return item.match(/\.js$/);
      });
      self.checks = checker_names_to_modules(names);
      cb();
    });
  } else {
    self.checks = checker_names_to_modules(self.checkers);
    cb();
  }

};

function checker_names_to_modules (names) {
  var mapping = {};

  names.forEach(function(item){ 
    var checker_module = require('./checkers/' + item);
    mapping[item] = checker_module;
  });
  
  return mapping;
}

Package.prototype.score = function score (cb) {
  var self = this;

  var names         = Object.getOwnPropertyNames(self.checks);
  var ret           = {
    overall:       { score: 0, total: 0 },
    scores:        {},
    checkers_used: []
  };

  var list_of_checkers = [];
  var i = 0;
  for(i=0; i < names.length; i++){
    var name = names[i];
    list_of_checkers.push(self.checks[name]);
  }

  async.each(
      list_of_checkers,
      function __score_iterator (item, callback) {
        var checker = new item(self.path);
        checker.score(function(scores) {
          ret.overall.score += scores.overall.score;
          ret.overall.total += scores.overall.total;

          ret.scores[ checker.name ] = scores.scores;
          ret.checkers_used.push(checker.name);
          callback();
        });
      },
      function __score_finalize (err) {
        // XXX - should we add more processing here? like percentages or
        // the like?
        cb(ret);
      }
  );
}

module.exports = Package;
