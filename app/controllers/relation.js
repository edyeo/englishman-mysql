var _ = require('lodash');

var db = require('orm').db,
  User = db.models.user;
  Language = db.models.language;
  Article = db.models.article;
  Sentence = db.models.sentence;
  Word = db.models.word;




exports.insert = function(req,res){
  //var relation = req.body;

  var relation = {
    userId : 3,
    langId : 1,
    kWords : [0],
    uWords : [1]
  }

  User.get(1,function(err,user){
    console.log(user);

    _.map(relation.kWords,function(kWord,idx){
      Word.find({id:1},function(err,kWordObj){
        User.hasMany('word',Word,{status:'integer'},{reverse:'users',key:true});
        user.addWord(kWordObj,{status:1},function(err){
          if(err) throw err;
          res.json({result:"ok"});
        });
      })
    });
  });



  //_.map(relation.uWords,function(word,idx){
  //  User.addWords(word,{status:0},function(err){
  //    if(err) throw err;
  //  });
  //});



}


