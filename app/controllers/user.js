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

exports.getUserInfo = function(req, res){
  var userId = req.params.userId;
  User.findAll({where:{id:userId}})
    .then(function(users){
      res.json({result:"ok"});
    })
    .catch(function(err) {
      res.json({error: err});
    });
};


