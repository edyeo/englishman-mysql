var db = require('orm').db;


var Language = db.define('language', {
  id: { type: 'integer' },
  name: String
}, {
  methods: {
    example: function(){
      // return example;
    }
  }
});

var Article = db.define('article',{
  id: { type:'integer'},
  language_id: {type:'integer'},
  title: String,
  author: String,
  contributor_id: String
})

var Sentence = db.define('sentence', {
  id: { type: 'integer' },
  order: { type: 'integer' },
  sentence: String,
  language_id: { type: 'integer' },
  article_id: { type: 'integer' }
}, {
  methods: {
    example: function(){
      // return example;
    }
  }
});


var User = db.define('user', {
  id: { type: 'integer' },
  name: String
}, {
  methods: {
    example: function(){
      // return example;
    }
  }
});


var Word = db.define('word', {
  id: { type: 'integer' },
  word: String,
  language_id: { type: 'integer' }
}, {
  methods: {
    example: function(){
      // return example;
    }
  }
});

Article.hasOne('language',Language);
Sentence.hasOne('language',Language);
Word.hasOne('language',Language);

User = User.hasMany('word',Word,{status:'integer'},{reverse:'users',key:true});
Word = Word.hasMany('sentences',Sentence,{},{reverse:'words',key:true});


db.sync(function(){
  console.log('DB SYNCHED');
});