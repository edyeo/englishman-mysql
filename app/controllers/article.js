var _ = require('lodash');
var db = require('../models/englishman').db;
var BASE_SCORE = 0.5;

var User = db.models.user;
  Language = db.models.language;
  ArticleNo = db.models.articleNo;
  Article = db.models.article;
  Sentence = db.models.sentence;
  Word = db.models.word;

var sequelize = db.sequelize;

function updateSentencesByArticle(articleNoId,articleReq,type,article){
  var stcArr = _.map(articleReq[type].sentences, function (stc, idx) {
    return {articleNoId: articleNoId, order: idx, sentence: stc, languageId: articleReq[type].langId, articleId: article.id, difficulty: BASE_SCORE}
  });

  var sentenceObjs = Sentence.bulkCreate(stcArr,{returning: true})
    .then(function(){
      return Sentence.findAll(
        {where:{
          languageId:articleReq[type].langId,
          articleId:article.id
        }});
    });

  return sentenceObjs;
}

function extractWordFromSentence(sentence){
  //var wordStrArr = sentence.sentence.match(/(\w+)\W/g);
  var wordStrArr = sentence.split(" ");
  return wordStrArr;
}

function updateWordsBySentences(articleReq,type,sentences){
  var promises = _.map(sentences, function (sentence, idx) {
    var wordStrArr = extractWordFromSentence(sentence.sentence);
    var wordObjArr = _.map(wordStrArr, function (wordStr, idx) {
      return {word: wordStr, languageId: articleReq[type].langId, difficulty: 0.5}
    });

    console.log(wordObjArr);

    Word.bulkCreate(wordObjArr, {
      ignoreDuplicates: true
    })
    .then(() => {
      return Word.findAll({
          where:{
            word:{
              $in: wordStrArr
            }
        }
      });
    })
    .then(function(words){
      sentence.addWords(words);
    });

  });

  return Promise.all(promises);
}

exports.fetch = function(req,res){
  var body = {
    articleId : 3,
    langIds : []
  };
  var cond = req.body;
  var articleList = _.map(cond.langIds,function(langId){
      return Article.findAll({
        where: {
          articleNoId : cond.articleNoId,
          languageId : langId
        }
      })
      .then(function(article) {
        return Sentence.findAll({
          where: {
            articleId: article.get("id"),
            languageId: langId
          }
        });
      });
  });

  return Promise.all(articleList)
    .then(function(result){
      res.json({result:result})
    })
    .catch(function(error){
      res.json({error:error});
    });
};

exports.create = function(req,res){

  var articleReq = req.body;
  ArticleNo.create({})
  .then(function(articleNo){
      console.log('----------------->>');
      console.log(articleNo);
      Promise.all([
      registerNewArticle(articleNo.get('id'),articleReq,"from"),
      registerNewArticle(articleNo.get('id'),articleReq,"to")
    ])
    .then(function(result){
      res.json({result:"ok"});
    })
    .catch(function(error){
      res.json({error:error});
    });
  });

  function registerNewArticle(articleNoId,articleReq,type){

    return sequelize.transaction(function(){
      return  Article.create({
            languageId:articleReq[type].langId,
            title:articleReq[type].title,
            author:articleReq[type].author,
            contributor_id:articleReq[type].contributorId,
            articleNoId: articleNoId
          })
        .then(function(article){
          return updateSentencesByArticle(articleNoId,articleReq,type,article)
        })
        .then(function(sentences){
          return updateWordsBySentences(articleReq,type,sentences);
        })
    });
  }
};

exports.update = function(req,res){

  var articleReq = req.body;
  Promise.all([
    updateArticle(articleReq,"from"),
    updateArticle(articleReq,"to")
  ])
  .then(() => { res.json({result:"ok"}); })
  .catch(() => { res.json({error:error}); });


  function updateArticle(articleReq,type){
    sequelize.transaction(function(){
      return Article.delete({
        where: {
          articleNoId: articleReq[type].articleNoId,
          languageId: articleReq[type].langId
        }
      }).then(function(aRows){
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
        res.json({result:err});
      });
    });
  }


};

exports.delete = function(req,res){

  var articleReq = req.body;
  Promise.all([
    deleteArticle(articleReq,"from"),
    deleteArticle(articleReq,"to")
  ])
    .then(function(result){
      res.json({result:"ok"});
    })
    .catch(function(error){
      res.json({error:error});
    });

  function deleteArticle(articleReq,type){

    return Article.delete({
      where: {
        articleNoId: articleReq[type].articleNoId,
        languageId: articleReq[type].langId
      }
    });

  }
};