(function(){

  'use strict';

  var $debug = debug('engman:Application');


  function config(
    $stateProvider,
    languageSvc
  ){
    $stateProvider
      .state('main',{
        //abstract: true,
        url:'',
        views:{
          nav:{
            templateUrl:'views/englishman/ng_nav.html'
          }
        }
      })
      .state('main.translator',{
        url:'/main/translator',
        views:{
          content:{
            templateUrl:'views/englishman/ng_translator.html',
            controller:'TranslatorController',
            controllerAs:'vm'
          }
        },
        resolve:{
          languages: ['languageSvc',function(languageSvc){


            return languageSvc.get().$promise.then(
              function(result){
                $debug("resolve languages : succ : " + result.languages);
                return {status:true,data:result.languages}
              },
              function(error){
                $debug("resolve languages : fail : " + error );
                return {status:false,data:error}
              }
            );
          }]
        }
      })
      .state('main.study',{
        url:'/main/study',
        views:{
          content:{
            templateUrl:'views/englishman/ng_study.html',
            controller:'StudySentenceController',
            controllerAs:'vm'
          }
        },
        resolve:{
          recommendSentences:['recommendSentenceSvc',function(rsSvc){
            var userId = 1; //TO DO : get UserId from local storage
            return rsSvc.get({userId:userId}).$promise.then(
              function(result){
                $debug(result);;
                return { status:true, data:result.sentences};
              },
              function(error){
                return { status:false, error:error};
              }
            )
          }]
        }
      })
      .state('main.study2',{
        url:'/main/study2',
        views:{
          content:{
            templateUrl:'views/englishman/ng_study_article.html',
            controller:'StudyArticleController',
            controllerAs:'vm'
          }
        },
        resolve:{
        }
      });
  }

  angular.module('engman',[
    'ui.router',
    'ui.bootstrap',
    'services.api.language',
    'services.api.article',
    'services.api.user',
    'services.api.recommendSentence',
    'services.api.relationUserWord'
  ])
    .config([
    '$stateProvider',
    config
  ])
  ;
})();