// requires express and body-parser
var express = require('express');
var bodyParser = require('body-parser');
var expressSessions = require('express-session');
var logger = require('morgan');
var passport = require('passport');

// Google oauth2 login, key, and secrets
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var configAuth = require('./auth');

// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy(configAuth.googleAuth,
  function(accessToken, refreshToken, profile, cb) {
    console.log('access token is', accessToken)
   
    return cb(null, profile);
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

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
app.use(express.static(__dirname + '/public'));	

//**** NOT SURE IF I NEED THESE WITH THE ONES BELOW
// // BodyParser interprets data sent to the server
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//testing MongoDB ******
// db.users.insert({
// 	"avatar": "http://test.com",
// 	"userName": "Joe Shmo",
// 	"email": "joe@email.com",
// 	"discoveries": 0,
// 	"edits": 0,
// 	"confirms": 0
// });

//******************************************************

// Define routes.
app.get('/',  function(req, res) {
  
    res.sendFile(__dirname + '/public/views/index.html');
  });

app.get('/login',
  function(req, res){
    
    res.sendFile(__dirname + '/public/views/login.html');
  });

app.get('/login/google',
  passport.authenticate('google', {scope: 'profile'}));

app.get('/login/google/return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    
    res.redirect('/profile');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    
   
    res.send({ user: req.user });
  });



//******************************************************



//starts the server letting user know the PORT
app.listen(PORT, function(){

	console.log("listening on port %d", PORT);

}); // end of app.listen