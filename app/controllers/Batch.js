var _ = require('lodash');
var db = require('../models/englishman').db;
var sequelize = db.sequelize;

var User = db.models.user;
  Language = db.models.language;
  ArticleNo = db.models.articleNo;
  Article = db.models.article;
  Sentence = db.models.sentence;
  Word = db.models.word;


exports.updateSentenceDifficulty = function(req,res){
  sequelize.transaction(function(t){
      Sentence.findAll({
          attributes: ['id',[sequelize.fn('AVG', sequelize.col('words.difficulty')), 'difficulty']],
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