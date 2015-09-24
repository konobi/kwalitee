
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

base_checker.prototype.gather_scores = function (ret){
  var self = this;

  self.get_score_test_names().forEach(function(test_function) {
    var score = self[test_function]();
    ret.overall.score += score[0];
    ret.overall.total += score[1];
    var test_name = test_function.replace(/^_score_/, '');
    ret.scores[test_name] = score;
  });

  return ret;
}

module.exports = base_checker;
