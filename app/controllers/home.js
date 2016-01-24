var _ = require('lodash');
console.log(__dirname);
var db = require('../models/englishman').db;
//var db = require('orm').db,
//  User = db.models.user;
//  Language = db.models.language;
//  Article = db.models.article;
//  Sentence = db.models.sentence;
//  Word = db.models.word;



var User = db.models.user;
  Language = db.models.language;
  ArticleNo = db.models.articleNo;
  Article = db.models.article;
  Sentence = db.models.sentence;
  Word = db.models.word;

var sequelize = db.sequelize;

exports.index = function(req, res){
  User.findAll({where:{id:1}}).then(function(users){
    console.log(users);
    res.json({result:"ok"});
  });
};

exports.insert = function(req,res){
/*  var article = {
    "from":{
    "langId":1,
      "title":"sample2",
      "author":"",
      "contributorId":3,
      "sentences":["It is a sample","I think so"]
  },
    "to":{
    "langId":2,
      "title":"sample2",
      "author":"",
      "contributorId":3,
      "sentences":["샘플입니다","저도 그렇게 생각해요"]
  }
  };*/

  var articleReq = req.body;
  console.log(articleReq);



  registerNewArticle(articleReq,"from");
  //registerNewArticle(articleReq,"to");

  function registerNewArticle(articleReq,type){


    sequelize.transaction(function(t){
      return ArticleNo.create({}).then(function(articleNo){
          return Article.create({
            languageId:articleReq[type].langId,
            title:articleReq[type].title,
            author:articleReq[type].author,
            contributor_id:articleReq[type].contributorId,
            articleNoId: articleNo.id
          });
        })
        .then(function(article){
          return updateSentencesByArticle(articleReq,type,article)
        })
        .then(function(sentences){
          return updateWordsBySentences(articleReq,type,sentences);
        })
        .then(function(result){
          res.json({});
        })
        .catch(function(err){
          throw err;
          res.json({result:error});
        });
    });
  }


  function updateSentencesByArticle(articleReq,type,article){
    var fromSTCarr = _.map(articleReq[type].sentences, function (stc, idx) {
      return {order: idx, sentence: stc, languageId: articleReq[type].langId, articleId: article.id}
    });

    var sentenceObjs = Sentence.bulkCreate(fromSTCarr,{returning: true})
      .then(function(){
        return Sentence.findAll(
          {where:{
            languageId:articleReq[type].langId,
            articleId:article.id
          }});
      });

    return sentenceObjs;
  }

  function updateWordsBySentences(articleReq,type,sentences){
    var promises = _.map(sentences, function (sentence, idx) {
      var wordStrArr = sentence.sentence.match(/(\w+)\W/g);
      var wordObjs = _.map(wordStrArr, function (wordStr, idx) {
        return {word: wordStr, languageId: articleReq[type].langId}
      });

      Word.bulkCreate(wordObjs, {
        ignoreDuplicates: true
      })
        .then(function(words){
          return Word.findAll({word:{$in:words}});
        })
        .then(function(words){
          sentence.addWords(words);
        });

    });

    return Promise.all(promises);
  }

}
