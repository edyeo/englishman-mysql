module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	var relation = require('../app/controllers/relation');
	var emModel = require('../app/models/englishman');

	//app.get('/', home.index);
	app.get('/',home.index);
	app.post('/',home.insert);

	app.post('/rel/words',relation.insert);

};
