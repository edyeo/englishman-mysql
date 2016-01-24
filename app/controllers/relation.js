var _ = require('lodash');

var db = require('../models/englishman').db,
  User = db.models.user;
  Language = db.models.language;
  Article = db.models.article;
  Sentence = db.models.sentence;
  Word = db.models.word;
  UserWord = db.models.userword;




exports.insert = function(req,res){
  //var relation = req.body;

  var relation = {
    userId : 3,
    langId : 1,
    kWords : [0],
    uWords : [1]
  }

  User.findAll({where:{id:1}})
    .then(function(users){
      Word.findAll({where:{id:1}})
        .then(function(words){
          users[0].setWords(words,{status:1}).then(function(){
            res.json({result:"ok"})
          });
        })
    });

  //_.map(relation.uWords,function(word,idx){
  //  User.addWords(word,{status:0},function(err){
  //    if(err) throw err;
  //  });
  //});



}


