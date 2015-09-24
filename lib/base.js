
function base_checker () {
}

base_checker.prototype.get_score_test_names = function () {
  var self = this;
  var score_test_funcs = Object.getOwnPropertyNames(Object.getPrototypeOf(self)).filter(function(value) {
    if(value.match('^_score_') ){
      return true;
    }
    return false;
  });

  return score_test_funcs;
}

module.exports = base_checker;
