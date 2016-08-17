// requires express and body-parser
var express = require('express');
var bodyParser = require('body-parser');
var expressSessions = require('express-session');
var logger = require('morgan');

//requiring and setting up mongo database/collections
var mongojs = require('mongojs');
var databaseUrl = "discoverIt";
var collections = ["users", "discoveries"];

// creates a databse in mongo called scrape with two collections: articles and comments
var db = mongojs('discoverIt', ['users', 'discoveries']);

// lets us know if there is an error with the database if it doesn't turn on
db.on('error', function(err) {
	console.log('Database Error: ', err);
});

// creating an instance of express
var app = express();
// assigning the port or using the PORT environment variable
var PORT = process.env.PORT || 3000; 

// makes static content in assets accessible
app.use(express.static(process.cwd() + '/public'));	

// BodyParser interprets data sent to the server
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

db.users.insert({
	"avatar": "http://test.com",
	"userName": "Joe Shmo",
	"email": "joe@email.com",
	"discoveries": 0,
	"edits": 0,
	"confirms": 0
})

//******************************************************

//require routes
require('./routing/html-routes.js')(app);

//******************************************************



//starts the server letting user know the PORT
app.listen(PORT, function(){

	console.log("listening on port %d", PORT);

}); // end of app.listen