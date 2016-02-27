var _ = require('lodash');
console.log(__dirname);
var db = require('../models/englishman').db;
var BASE_SCORE = 0.5;

var User = db.models.user;
  Language = db.models.language;
  ArticleNo = db.models.articleNo;
  Article = db.models.article;
  Sentence = db.models.sentence;
  Word = db.models.word;

var sequelize = db.sequelize;

exports.getAll = function(req,res){
  Language
    .findAll()
    .then(function(languageArr){
      res.json({languages:languageArr});
    })
    .catch(function(err){
      res.json(err);
    })
}
