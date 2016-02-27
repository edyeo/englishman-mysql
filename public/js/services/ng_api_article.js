(function(){
  'use strict';

  function ArticleSvc($resource){
    var apiURL = '/api/article';
    return $resource(apiURL);
  }

  angular.module('services.api.article',['ngResource'])
    //.factory('languageSvc',function(){return 3;});
    .factory('articleSvc',[
      '$resource',
      ArticleSvc
    ]);
})();