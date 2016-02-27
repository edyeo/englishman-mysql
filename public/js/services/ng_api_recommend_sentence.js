(function(){
  'use strict';

  function RecommendSentenceSvc($resource){
    var apiURL = '/api/recommend/sentence/:userId';
    return $resource(apiURL);
  }

  angular.module('services.api.recommendSentence',['ngResource'])
    .factory('recommendSentenceSvc',[
      '$resource',
      RecommendSentenceSvc
    ]);
})();