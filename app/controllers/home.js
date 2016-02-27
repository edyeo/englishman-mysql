var _ = require('lodash');
console.log(__dirname);
var db = require('../models/englishman').db;
//var db = require('orm').db,
//  User = db.models.user;
//  Language = db.models.language;
//  Article = db.models.article;
//  Sentence = db.models.sentence;
//  Word = db.models.word;

var BASE_SCORE = 0.5;

var User = db.models.user;
  Language = db.models.language;
  ArticleNo = db.models.articleNo;
  Article = db.models.article;
  Sentence = db.models.sentence;
  Word = db.models.word;

var sequelize = db.sequelize;

exports.index = function(req, res){
  console.log(__dirname);
  res.render('../views/englishman/index.jade');
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

    sequelize.transaction(function(){
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
      return {order: idx, sentence: stc, languageId: articleReq[type].langId, articleId: article.id, difficulty: BASE_SCORE}
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
        return {word: wordStr, languageId: articleReq[type].langId, difficulty: 0.5}
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


exports.registerWord = function(req,res){
  var uwr = {
    userId : 1,
    knownWords : [1,3],
    unknownWords : [2]
  }

  //var uwr = req.body;
  var userId = uwr.userId;
  var kWordArr = uwr.knownWords;
  var ukWordArr = uwr.unknownWords;

  sequelize.transaction(function(t){
    return User.find({
      where:{id:userId},
      limit:1
    })
    .then(function(user){
      if (user===null){
        throw error("no matched user");
      }
      return user.addWords(kWordArr,{status:1});
    })
    .then(function(kUserWords){
        console.log(kUserWords);
        if (kUserWords.length == 0) res.json({score:BASE_SCORE});

        var wordFilter =
          _.map(kUserWords,function(uw){
            return uw.get('word_id');
          });

        var sql = [
          "select " ,
          "wordId as word_id,",
          "sum(if(status=1,1,0)) / count(wordId) as word_score" ,
          "from englishman_dev.user_words" ,
          "where wordId in (:uw)",
          "group by wordId"
        ].join(" ");
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT,  replacements : { uw : uwr.knownWords } });
    })
    .then(function(wordInfoArr){
        var updateArr = _.map(wordInfoArr,function(wordInfo){
          return Word.update({
            difficulty:wordInfo.word_score
          },{
            where:{
              id:wordInfo.word_id
            }
          });
        });
        return Promise.all(updateArr);
      })
      .then(function(){
        var sql = [
          "select " ,
          "wordId as word_id,",
          "sum(if(status=1,1,0)) / count(wordId) as word_score" ,
          "from englishman_dev.user_words" ,
          "where wordId in (:uw)",
          "group by wordId",
        ].join(" ");
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT,  replacements : { uw : uwr.knownWords } });

      })
    .then(function(result){
      res.json({result:result});
    })
    .catch(function(error){
        throw error;
      res.json({result:error});
    });
  });
}

exports.updateSentenceDifficulty = function(req,res){
  sequelize.transaction(function(t){
      Sentence.findAll({
          attributes: ['id',[sequelize.fn('AVG', sequelize.col('words.difficulty')), 'difficulty']],
          //attributes: [["words.difficulty", 'difficulty']],
          include: [{
            model: Word
          }]
        , group: ['id']
      })
      .then(function(sentenceInfoList){
          var updateArr = _.map(sentenceInfoList,function(sentenceInfo){
            return Sentence.update({
              difficulty:sentenceInfo.difficulty
            },{
              where:{
                id:sentenceInfo.id
              }
            });
          });
          return Promise.all(updateArr);
      })
      .then(function(result){
        res.json({result:result});
      })
      .catch(function(error){
        throw error;
        res.json({result:error});
      });
  });
}

exports.updateUserFluency = function(req,res){
  sequelize.transaction(function(t){
    return User.findAll({
      attributes: ['id',[sequelize.fn('AVG', sequelize.col('words.difficulty')), 'level']],
      //attributes: [["words.difficulty", 'difficulty']],
      include: [{
        model: Word
      }]
      , group: ['id']
    })
    .then(function(userInfoList){
        _.map(userInfoList,function(userInfo){
          console.log(userInfo.id,userInfo.level);
        });
        var updateArr = _.map(userInfoList,function(userInfo){
        return Sentence.update({
          difficulty:userInfo.difficulty
        },{
          where:{
            id:userInfo.id
          }
        });
      });
      return Promise.all(updateArr);
    });
  })
  .then(function(result){
    res.json({result:result});
  })
  .catch(function(error){
    res.json({result:error});
  });
}