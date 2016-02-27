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
  UserWord = db.models.userword;

var sequelize = db.sequelize;
var BASE_SCORE = 50.0; //TO DO : propertize!!

exports.getUserScore = function(req, res){
  var userId = req.params.userId;
  UserWord.findAll({
    attributes:[['wordId','word_id']],
    where:{
      userId:userId
    }
  })
  .then(function(uws){

    // CASE 00 : no user-word relation record
    if (uws.length == 0) res.json({score:BASE_SCORE});

    var wordFilter =
      _.map(uws,function(uw){
        return uw.get('word_id');
      });


    var sql = [
      "select AVG(word_score) as word_score from" ,
      "(" ,
      "select " ,
      "sum(if(:status=1,1,0)) / count(wordId) as word_score" ,
      "from englishman_dev.user_words" ,
      "where wordId in (:uw)" ,
      ") as T1"
    ].join(" ");
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT,  replacements : { status: "status", uw : wordFilter } });
  })
  .then(function(qr){
    res.json({result:qr[0].word_score});
  })
  .catch(function(error){
    res.json({result:error.toString()});
  });
};
