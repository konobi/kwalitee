#!/usr/bin/env node

var mm = require('minimist');
var fs = require('fs');
var path = require('path');
var util = require('util');
var kwal = require('../lib');

var argv = mm(process.argv.slice(2), {
  "boolean": [ 'verbose', 'no-color', 'parseable', 'help' ],
  "alias": { 'verbose': 'v', 'no-color': 'C', 'parseable': 'H', 'help': 'h' }
});

var directory = argv._[0];
var print_usage = false;
var error_usage = false;

if(argv.help) print_usage = true;
if(!directory) print_usage = true;

if(directory) {
  var dir_stat;
  try {
    dir_stat = fs.statSync(directory);
  } catch (e) {};
  if(!dir_stat || !dir_stat.isDirectory()) {
    error_usage = "Supplied path does not exist or is not a directory";
    print_usage = true;
    var pkg_json_stat;
    try {
      pkg_json_stat = fs.statSync( path.join(directory, 'package.json') );
    } catch (e) {};
    if(!pkg_json_stat || !pkg_json_stat.isFile()) {
      error_usage = "Supplied path does not have a package.json file within";
    }
  }
}

if(error_usage) {
  console.error("\n" + error_usage + "\n");
}

if(print_usage) {
  var script_name = path.basename(process.argv[1], '.js');
  var usage = util.format("\
%s [-h|--help] [-v|--verbose] [-C|--no-color] [-H|--parseable] <path> \n\n\
  Options:\n\
    --help:       Display this usage information\n\
    --verbose:    Display extended information about kwalitee scoring\n\
    --no-color:   Don't display scoring information with color\n\
    --parseable:  Print scoring information in a machine readable way\n\
", 
    script_name);
  
  console.log(usage);
}

var foo = new kwal({ "path": path.resolve(directory) });
foo.init(function(){
  foo.score(print_scores);
});

function print_scores (scores) { 
  if(!argv.verbose) {
    console.log("Kwalitee Score: " + (scores.overall.score / scores.overall.total));
    console.log("    (score/total): " + scores.overall.score + " / " + scores.overall.total);
  } else {
    console.log("Kwalitee Score: " + (scores.overall.score / scores.overall.total));

    scores.checkers_used.forEach(function(item) {
      console.log("\n" + item + ":");
      Object.getOwnPropertyNames(scores.scores[item]).forEach(function(check) {
        var check_scores = scores.scores[item][check];
        var amount = (check_scores[0] / check_scores[1]);

        var msg = util.format("    %s:\n      %s  (%s / %s)", check, amount, check_scores[0], check_scores[1]);
        console.log(msg);
      });
    });
  }
}
