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
var SEARCH_BOUND = 0.1;
var DEFAULT_FLUENCY = 0.5;

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

exports.fetchSentences = function(req, res){
  var userId = req.params.userId;
  var langFromId = req.query.lang_id_from;
  var langToId = req.query.lang_id_to;
  var minUF;
  var maxUF;

  var toSentences = User.findAll({
    where:{
      id : userId
    }
  })
  .then(function(user){
    var userFluency = user.fluency;
    if(userFluency == null) userFluency = DEFAULT_FLUENCY;
    minUF = userFluency - SEARCH_BOUND;
    maxUF = userFluency + SEARCH_BOUND;

    return Sentence.findAll({
      where:{
        difficulty:{
          $gte:minUF
        },
        difficulty:{
          $lte:maxUF
        },
        languageId: langToId
      },
      include:{
        model:Word
      }
    });
  });

  var fromSentences = toSentences.then(function(toSentences){
      var query = _.map(toSentences,function(sentence){
        return Sentence.findOne({
          where :{
            articleId : sentence.articleId,
            order : sentence.order,
            languageId : langFromId
          }
        });
      });

      return Promise.all(query);
  });

  Promise.all([toSentences,fromSentences]).then(function(toSentences,fromSentences){
    return {
      toSentences: toSentences,
      fromSentences: fromSentences
    };
  })
  .then(function(sentences){
    res.json({sentences:sentences});
  })
  .catch(function(error){
    res.json({error:error});
  });
  // TO DO : order by & limit 10
}

