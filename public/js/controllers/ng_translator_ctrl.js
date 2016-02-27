(function(){
  'use strict';
  var $debug = debug('engman:translatorCtrl');

  function TranslatorController(
    articleSvc,
    languages
  ){
    var vm = this;

    vm.article = {
      from:{
        langId:-1,
        title:"",
        author:"",
        contributorId:1,
        sentences:[]
      },
      to:{
        langId:-1,
        title:"",
        author:"",
        contributorId:1,
        sentences:[]
      }
    };

    if(!languages.status){
     alert('empty languages');
    }else{
     vm.languages = languages.data;
     $debug(languages.data);
    }

    vm.addSentenceBox = function(type){
      $debug("addSentenceBox-" + type + "-called");
      vm.article[type].sentences.push("");
    }

    vm.removeSentenceBox = function(type){
      $debug("addSentenceBox-" + type + "-called");
      var stcs = vm.article[type].sentences;
      stcs.splice(stcs.length - 1, 1);
    }

    vm.submitArticle = function(article){
      $debug("submitArticle-" + "called");
      articleSvc.save(vm.article).$promise.then(
        function(result){
          if(result.status == 200){
            console.log(result);
          }else{
            console.log(result);
          }
        },
        function(error){
          alert(error);
        }
      )
    }

  }

  angular.module('engman')
    .controller('TranslatorController',[
      'articleSvc',
      'languages',
      TranslatorController]);
})();