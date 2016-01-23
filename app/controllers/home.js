var _ = require('lodash');

var db = require('orm').db,
  User = db.models.user;
  Language = db.models.language;
  Article = db.models.article;
  Sentence = db.models.sentence;
  Word = db.models.word;

exports.index = function(req, res){
  User.find(function(err, articles){
    if(err) throw new Error(err);
    res.render('home/index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
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

  var article = req.body;

  Article.create({
    language_id:article.from.langId,
    title:article.from.title,
    author:article.from.author,
    contributor_id:article.from.contributorId
  },function(err,item) {
    if (err) throw err;

    var fromSTCarr = _.map(article.from.sentences, function (stc, idx) {
      return {order: idx, sentence: stc, language_id: article.from.langId, article_id: item.id}
    });

    Sentence.create(fromSTCarr, function (err, items) {
      _.map(items, function (item, idx) {
        var words = item.sentence.match(/(\w+)\W/g);

        var wordArr = _.map(words, function (word, idx) {
          return {word: word, language_id: article.from.langId}
        });

        _.map(wordArr, function (wordObj, idx) {
          Word.count({word: wordObj.word}, function (err, cnt) {
            if (err) throw err;
            if (cnt > 0) {
              Word.create(wordArr, function (words, idx) {
                return true;
              })
            }
          });
        });

      })
    });
  });

  Article.create({
    language_id:article.to.langId,
    title:article.to.title,
    author:article.to.author,
    contributor_id:article.from.contributorId
  },function(err,item) {
    if (err) throw err;

    Word.create({word:"123",language_id:2},function(err,items){
      if(err) throw err;
    });

    var fromSTCarr = _.map(article.from.sentences, function (stc, idx) {
      return {order: idx, sentence: stc, language_id: article.from.langId, article_id: item.id}
    });

    var toSTCarr = _.map(article.to.sentences, function (stc, idx) {
      return {order: idx, sentence: stc, language_id: article.to.langId, article_id: item.id}
    });

    Sentence.create(toSTCarr, function (err, items) {
      _.map(items, function (item, idx) {
        var words = item.sentence.match(/(\w+)\W/g);

        var wordArr = _.map(words, function (word, idx) {
          return {word: word, language_id: article.to.langId}
        });

        _.map(wordArr, function (wordObj, idx) {
          Word.count({word: wordObj.word}, function (err, cnt) {
            if (err) throw err;
            if (cnt > 0) {
              Word.create(wordArr, function (words, idx) {
                return true;
              })
            }
          });
        });

      });
    });
  });

  res.json({});

}
