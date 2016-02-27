var _ = require('lodash');
var debug = require('debug')('engman_api');
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
  User.findAll({where:{id:1}}).then(function(users){
    console.log(users);
    res.json({result:"ok"});
  });
};

exports.registerWord = function(req,res){
/*
  sample
  var uwr = {
    userId : 1,
    knownWords : [1,3],
    unknownWords : [2]
  }
*/

  var uwr = req.body;
  var userId = uwr.userId;
  var kWordArr = uwr.knownWords;
  var ukWordArr = uwr.unknownWords;


  function updateUserWordRel(userId,targetWordIdArr){
    return sequelize.transaction(function(t) {
      return User.find({
        where: {id: userId},
        limit: 1
      })
        .then(function (user) { // update User-Word Relation
          if (user === null) {
            throw error("no matched user");
          }
          return user.addWords(targetWordIdArr, {status: 1});
        })
        .then(function (userWords) { // update word difficulty by newly updated relation

          var wordFilter =
            _.map(userWords, function (uw) {
              return uw.get('word_id');
            });

          var sql = [
            "select ",
            "wordId as word_id,",
            "sum(if(status=1,1,0)) / count(wordId) as word_score",
            "from englishman_dev.user_words",
            "where wordId in (:uw)",
            "group by wordId"
          ].join(" ");

          var updateWordDifficulty = sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {uw: targetWordIdArr}
          })
            .then(function (wordInfoArr) {
              var updateArr = _.map(wordInfoArr, function (wordInfo) {
                return Word.findOne({ where: { id: wordInfo.word_id }})
                .then((word) => { return word.update({ difficulty: wordInfo.word_score }); });
              });
              return Promise.all(updateArr);
            });

          return updateWordDifficulty;
        })
        .then((updatedWordArr) => {
          console.log(updatedWordArr);
          var targetWordAndUpdateResultObj = {};
          _.forEach(targetWordIdArr, (targetWordId, idx) => {
            targetWordAndUpdateResultObj[targetWordId] = updatedWordArr[idx];
          });
          return targetWordAndUpdateResultObj;
        })
        .catch((error) => {
          throw error;
        });
    });
  }

  var knownWordUpdateJob = Promise.resolve(() => { return []; })
  var unknownWordUpdateJob = Promise.resolve(() => { return []; })
  if(kWordArr.length != 0) {
    knownWordUpdateJob = updateUserWordRel(userId, kWordArr);
  }

  if(ukWordArr.length != 0) {
    unknownWordUpdateJob = updateUserWordRel(userId, ukWordArr);
  }

  return Promise.all([knownWordUpdateJob,unknownWordUpdateJob])
    .then((result) => {
      res.json({
        status: 200,
        result: result
      })})
    .catch((error) => {
      console.log(error);
      res.json({
        status: 500,
        result: error.toString()
      })
    });
}