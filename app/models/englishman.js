config = require('./../../config/config');

var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.sequelizeConnURL,{charset:'utf8'});

var Language = sequelize.define('language', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  }
},{ timestamps:false });

var ArticleNo = sequelize.define('article_no',{
  id: {
    type:Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
},{ timestamps:false });

var Article = sequelize.define('article',{
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {type:Sequelize.STRING},
  author: {type:Sequelize.STRING},
  contributor_id: {type:Sequelize.STRING}
},{ timestamps:false });

var Sentence = sequelize.define('sentence', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order: { type: Sequelize.INTEGER },
  sentence: { type: Sequelize.STRING },
  difficulty: { type: Sequelize.DOUBLE }
},{ timestamps:false });


var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: Sequelize.STRING },
  level: { type: Sequelize.DOUBLE }
},{ timestamps:false });


var Word = sequelize.define('word', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  word: {
    type: Sequelize.STRING,
    unique: true
  },
  difficulty: { type: Sequelize.DOUBLE }

},{ timestamps:false });

var UserWord = sequelize.define('user_word',{
  status: {type:Sequelize.INTEGER}
},{ timestamps:false });

var SentenceWord = sequelize.define('sentence_word',{
},{ timestamps:false });

Language.hasMany(Article,{as:"lang_id", underscored: true});
Language.hasMany(Sentence,{as:"lang_id", underscored: true});
Language.hasMany(Word,{as:"lang_id"});

ArticleNo.hasMany(Article);
ArticleNo.hasMany(Sentence);
Article.hasMany(Sentence);

User.belongsToMany(Word,{through:UserWord, underscored: true});
Sentence.belongsToMany(Word,{through:SentenceWord, underscored: true});


sequelize.sync().then(function(err,result) {
  console.log("sequelize synced!!")
}).catch(function(error) {
  throw error;
});


exports.db = {
  models : {
    user: User,
    language: Language,
    article: Article,
    articleNo: ArticleNo,
    sentence: Sentence,
    word: Word,
    userword : UserWord
  },
  sequelize : sequelize
};



