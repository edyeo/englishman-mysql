(function() {
  'use strict';
  var $debug = debug('engman:studyCtrl');

  function StudyArticleController(
  userSvc,
  recommendSentenceSvc,
  relationUserWordSvc,
  recommendSentences
  ) {

    $debug(recommendSentences);
    var vm = this;

    var userId = 1;
    vm.selectWord = function (word) {
      $debug('selectWord called : ' + word.word + ' ' + word.isSelected + ' => ' + !word.isSelected);
      word.isSelected = !word.isSelected;
    }

    function initSentence(sentenceObj) {
      _.forEach(sentenceObj.words, (word) => {
        word.isSelected = false;
      });
      return sentenceObj;
    }

    vm.registerUserWordRelation = function(){
      var words = vm.sentenceToStudy.words;
      var wordGroups = _.groupBy(words,(word) => {
        return word.isSelected;
      });
      var wordRelation = {
        userId: userId,
        knownWords : _.map(wordGroups.true,(word)=> { return word.id; }),
        unknownWords : _.map(wordGroups.false,(word)=> { return word.id; })
      };
      $debug('request registerUserWordRelation : ', words, wordGroups, wordRelation );
      relationUserWordSvc.save(wordRelation).$promise.then(
        (result) => {
          $debug('response registerUserWordRelation',result );
          alert("success");
        },
        (error) => {
          $debug('response registerUserWordRelation',error );
          alert("failure");
        }
      );
    }


    if (!recommendSentences.status) {
      alert("error");
    } else {
      vm.sentenceToStudy = recommendSentences.data[0];
      initSentence(vm.sentenceToStudy);
    }
  }

  angular.module('engman')
    .controller('StudyController',[
      'userSvc',
      'recommendSentenceSvc',
      'relationUserWordSvc',
      'recommendSentences',
      StudyArticleController]);
})();