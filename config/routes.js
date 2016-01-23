module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	var relation = require('../app/controllers/relation');

	//app.get('/', home.index);
	app.get('/',home.index);
	app.post('/',home.insert);

	app.post('/rel/words',relation.insert);

};
