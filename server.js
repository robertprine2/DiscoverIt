// shhhh it's a secret
var configAuth = require('./auth');

// requires express and body-parser
var express = require('express');
var bodyParser = require('body-parser');
var expressSessions = require('express-session');
var logger = require('morgan');
var passport = require('passport');
var GoogleMapsAPI = require('googlemaps');

// setting up cloudinary api
var cloudinary = require('cloudinary');
cloudinary.config({ 
   cloud_name: configAuth.cloudinary.cloud_name, 
   api_key: configAuth.cloudinary.api_key, 
   api_secret: configAuth.cloudinary.api_secret 
});

// Google oauth2 login, key, and secrets
var GoogleStrategy = require('passport-google-oauth20').Strategy;

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

//googlemaps

var publicConfig = {
  key:                configAuth.googleMapAPIKey,
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
  proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests
};
var gmAPI = new GoogleMapsAPI(publicConfig);

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
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    
    res.redirect('/main');
  });

app.get('/main',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
      
      db.users.find({userName: req.user.displayName}, function(err, data){
          console.log(data);
          if (data.length >= 1){
            res.sendfile(__dirname + '/public/views/main.html');
          }

          else {

            db.users.insert({
              "email": "",
              "avatar": req.user.photos[0].value,
              "userName": req.user.displayName,
              "googleId": req.user.id,
              "discoveries": 0,
              "edits": 0,
              "confirms": 0,
              "points": 0
            });

            res.sendfile(__dirname + '/public/views/main.html');

          }
      });

      
  });

  app.post('/discover', function(req, res){

      var image = req.body.discovery.image;
      console.log(image);
      cloudinary.uploader.upload(image, function(result) { 
          console.log(result);
          var imageUrl = result.url;
      
          db.discoveries.insert({
            "user": req.user.displayName,
            "userId": req.user.id,
            "image": imageUrl,
            "name": req.body.discovery.name,
            "objectType": req.body.discovery.objectType,
            "description": req.body.discovery.description,
            "location": req.body.discovery.location,
            "discoveredOn": req.body.discovery.discoveredOn
          }); //end of db.discoveries.insert

      }); // end of cloudinary.uploader

//*********************************
      //increase user discovery count
//**********************************
      res.send("You submitted your discovery to the database!");

  });

  app.get('/map', function(req, res) {

      // reverse geocode API
      var reverseGeocodeParams = {
        "latlng":        "51.1245,-0.0523",
        "result_type":   "postal_code",
        "language":      "en",
        "location_type": "APPROXIMATE"
      };

      gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
        console.log(result);
      });

  });

  app.get('/currentUser', function(req, res) {

      db.users.find({$and: [{userName: req.user.displayName}, {googleId: req.user.id}]}, function(err, data){
          
          res.send(data);

      });
  });

  app.get('/find', function(req, res) {
      
      db.discoveries.find({}, function(err, data) {
          res.send(data);

      });

  });

//******************************************************



//starts the server letting user know the PORT
app.listen(PORT, function(){

	console.log("listening on port %d", PORT);

}); // end of app.listen