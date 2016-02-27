(function(){
  'use strict';

  function RelationUserWordSvc($resource){
    var apiURL = '/api/relation/user/word';
    return $resource(apiURL);
  }

  angular.module('services.api.relationUserWord',['ngResource'])
    //.factory('languageSvc',function(){return 3;});
    .factory('relationUserWordSvc',[
      '$resource',
      RelationUserWordSvc
    ]);
})();