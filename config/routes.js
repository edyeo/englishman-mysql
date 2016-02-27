module.exports = function(app){

	var home = require('../app/controllers/home');
	var user = require('../app/controllers/user');
	var article = require('../app/controllers/article');
	var language = require('../app/controllers/language');
	var sentence = require('../app/controllers/sentence');
	var userWordRel = require('../app/controllers/UserWordRel');
	var batch = require('../app/controllers/Batch');
	var recommend = require('../app/controllers/RecommendCtrl');


	// -----------------------------------------------------
	// VIEW
	// -----------------------------------------------------
  app.get('/',home.index);


	// -----------------------------------------------------
	// API
	// -----------------------------------------------------
	app.get('/api/languages/all',language.getAll);

	app.get('/api/article',article.fetch);
	app.post('/api/article',article.create);
	app.put('/api/article',article.update);
	app.delete('/api/article',article.delete);

	app.post('/api/relation/user/word',userWordRel.registerWord);

	app.get('/api/user/:userId',user.getUserInfo);

	app.post('/api/batch/sentence/difficulty',batch.updateSentenceDifficulty);
	app.post('/api/batch/user/fluency',batch.updateUserFluency);

	app.get('/api/recommend/sentence/:userId',recommend.fetchSentences);

	//app.get('/score/word/:wordId',score.getWordScore);


	app.use(function(req,res,next){
		console.log(req);
		next();
	});

};
