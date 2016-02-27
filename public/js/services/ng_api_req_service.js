(function(){
  'use strict';

  var URL = '/api/article';
  function APIService(
   $resource
  ){
    return $resource(URL);
  }

  angular.module('engman')
    .factory('APIService',[
      '$resource',
      APIService
    ]);
})();