(function(){
  'use strict';

  function LanguageSvc($resource){
    var apiURL = '/api/languages/all';
    return $resource(apiURL);
  }

  angular.module('services.api.language',['ngResource'])
    //.factory('languageSvc',function(){return 3;});
    .factory('languageSvc',[
      '$resource',
      LanguageSvc
    ]);
})();