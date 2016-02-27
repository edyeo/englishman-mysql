(function(){
  'use strict';

  function UserSvc($resource){
    var apiURL = '/api/user/:userId';
    return $resource(apiURL);
  }

  angular.module('services.api.user',['ngResource'])
    //.factory('languageSvc',function(){return 3;});
    .factory('userSvc',[
      '$resource',
      UserSvc
    ]);
})();