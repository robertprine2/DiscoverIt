// shhhh it's a secret
var configAuth = require('auth');

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

// MongoLab for deploying to heroku
var db = mongojs(process.env.MONGODB_URI, ['users', 'discoveries']);

// creates a databse in mongo called scrape with two collections: articles and comments
// var db = mongojs('discoverIt', ['users', 'discoveries']);

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
      
      db.users.find({googleId: req.user.id}, function(err, data){
          console.log(data);
          if (data.length >= 1){
            res.sendfile(__dirname + '/public/views/main.html');
          }

          else {

            if (req.user.photos.length < 1) {
                req.user.photos.push('/public/images/personlogo.jpg');
                console.log(req.user.photos);
            }

            db.users.insert({
              "email": "",
              "avatar": req.user.photos[0].value,
              "userName": req.user.displayName,
              "googleId": req.user.id,
              "discoveries": 0,
              "edits": 0,
              "finds": 0,
              "confirms": 0,
              "confirmedImages": [],
              "points": 0
            });

            res.sendfile(__dirname + '/public/views/main.html');

          }
      });

      
  });

  app.get('/logout', function(req, res) {
      console.log("logged out!");
      req.logout();
      res.redirect('/');
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
            "discoveredOn": req.body.discovery.discoveredOn,
            "suggestedEdits": [],
            "confirms": 0
          }); //end of db.discoveries.insert

      }); // end of cloudinary.uploader

//*********************************
      //increase user discovery count
//**********************************
      
      db.users.find({googleId: req.user.id}, function(err, found) {
          console.dir(found);

          var newDiscoveryCount = parseInt(found[0].discoveries) + 1;
          console.log("discoveries: " + found[0].discoveries);

          var newPointsCount = parseInt(found[0].points) + 5; 
          console.log("points: " + found[0].points);
          
          db.users.update({googleId: req.user.id}, {$set: {discoveries: newDiscoveryCount, points: newPointsCount}}, function(err, docs) {
              if (err) console.log(err);
              console.log(docs);
          });

      })
      

      res.send("You submitted your discovery to the database!");

  });

  app.get('/mapkey', function(req, res) {

      res.send(configAuth.googleMapAPIKey);

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

  app.post('/findImage', function(req, res) {

      console.dir(req.body);

      db.discoveries.find({image: req.body.image}, function(err, data) {
          console.dir(data);
          res.send(data);
      });

  });

  app.post('/confirm', function(req, res) {
      
      var confirmedImage = req.body.modal.image;

      var userLatitude = req.body.latitude;

      var userLongitude = req.body.longitude;
      
      var discoveryFoundBy = req.body.modal.userId;

      db.discoveries.find({image: confirmedImage}, function(err, foundDiscovery) {

          console.dir(foundDiscovery);

          var discoveryLatitudeAdd = foundDiscovery[0].location.lat + .02;

          var discoveryLatitudeSub = foundDiscovery[0].location.lat - .02;

          var discoveryLongitudeAdd = foundDiscovery[0].location.lng + .02;

          var discoveryLongitudeSub = foundDiscovery[0].location.lng - .02;

          console.log(discoveryLatitudeAdd);
          console.log(discoveryLatitudeSub);
          console.log(discoveryLongitudeAdd);
          console.log(discoveryLongitudeSub);


          db.users.find({googleId: req.user.id}, function(err, foundUser) {

              // if user isn't confirming more than once and isn't confirming his own discovery
              if (foundUser[0].confirmedImages.indexOf(confirmedImage) < 0
                  && foundUser[0].googleId != discoveryFoundBy
                  && discoveryLatitudeAdd > userLatitude 
                  && discoveryLatitudeSub < userLatitude
                  && discoveryLongitudeAdd > userLongitude
                  && discoveryLongitudeSub < userLongitude) {

                  // new finds count and points for user
                  var userFindCount = parseInt(foundUser[0].finds) + 1;
                  var newPointsCount = parseInt(foundUser[0].points) + 10;

                  // new confirms count for discovery
                  var newConfirmCount = parseInt(req.body.modal.confirms) + 1;

                  // adds image url to confirms array so that they can't confirm more than once
                  db.users.update({googleId: req.user.id}, {$push: {confirmedImages: confirmedImage}}, function(err, docs) {
                      if (err) console.log(err);
                      console.log(docs);
                  });

                  // add points and find count to user that found discovery
                  db.users.update({googleId: req.user.id}, {$set: {finds: userFindCount, points: newPointsCount}}, function(err, docs) {
                      if (err) console.log(err);
                      console.log(docs);
                  });

                  // adds confirm count to discovery
                  db.discoveries.update({image: confirmedImage}, {$set: {confirms: newConfirmCount}}, function(err, docs) {
                      if (err) console.log(err);
                      console.log(docs);
                  });

                  // adds points and confirm count to the discoverer
                  db.users.find({googleId: discoveryFoundBy}, function(err, discoverer) {
                      
                      if (err) console.log(err);
                      console.log(discoverer);
                      
                      // new confirm count and points for discoverer
                      var newDiscovererConfirms = parseInt(discoverer[0].confirms) + 1;
                      var newDiscovererPoints = parseInt(discoverer[0].points) + 10;

                      db.users.update({googleId: discoveryFoundBy}, {$set: {confirms: newDiscovererConfirms, points: newDiscovererPoints}}, function(err, docs) {
                        
                        if(err) console.log(err);
                        console.log(docs);

                      });

                  });
                  
                  res.send({success: "You found it! +10 points"});

              } // end of if user is confirming own finds or trying to confirm more than once.

              else if (discoveryLatitudeAdd < userLatitude 
                  || discoveryLatitudeSub > userLatitude
                  || discoveryLongitudeAdd < userLongitude
                  || discoveryLongitudeSub > userLongitude) {

                  console.log("You aren't close enough to find this discovery. Keep looking!")
                  res.send("You aren't close enough to find this discovery. Keep looking!")

              }

              else if (foundUser[0].googleId == discoveryFoundBy) {
                  console.log("You can't confirm your own discoveries!");
                  res.send("You can't confirm your own discoveries!");

              }

              else {
                  console.log("You have already confirmed this!");
                  res.send("You have already confirmed this!");

              }

          }); // end of db.users.findGoogleId

      }); // end of db.discoveries.findimage

  }); // end of app.post confirm

//******************************************************



//starts the server letting user know the PORT
app.listen(PORT, function(){

	console.log("listening on port %d", PORT);

}); // end of app.listen