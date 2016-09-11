var latitude = 0;
var longitude = 0;

angular.module('app')
	.controller('discoverCtrl', ['$scope', '$http', function($scope, $http, $log, $timeout) {
        $scope.title = "Discover It!";
        $scope.showMessageSuccess = false;
        $scope.showMessageError = false;
        $scope.success = "";
        $scope.error = "";
        $scope.objects = ['animal', 'art', 'food', 'landform', 'object', 'plant', 'pokemon', 'vehicle'];

        $scope.mapKey = "";

        $scope.addDiscovery = function() {
        	
        	cloudinary.openUploadWidget({ cloud_name: 'dfsidsh0y', upload_preset: 'exy3o3ab'}, 
            function(error, result) { 
                
                var imageUrl = result[0].secure_url;
                
                // helps to removes "string:" in front of value
                str = $('#objectType').val();
                
                initMap();

                var discovery = {};
        
                discovery.name = $('#name').val();
                discovery.objectType = str.substring(7, str.length);
                discovery.description = $('#description').val();
	        	discovery.image = imageUrl;
	        	discovery.location = {
                    lat: latitude,
                    lng: longitude
                }/*gps api call*/;
	        	discovery.discoveredOn = Date.now();
	        	console.log(discovery);
	        	
	        	$http.post('/discover', {discovery: discovery}).then(function(data) {
	        			
                console.log(data);
		            
                if (data.data.success) {
                    $scope.success = data.data.success;

                    $scope.showMessageSuccess = true;

                    $timeout(function() {

                        $scope.showMessageSuccess = false;
                        
                    }, 3000);
                }

                else {
                    $scope.error = data.data.error;

                    $scope.showMessageError = true;

                    $timeout(function() {
                        
                        $scope.showMessageError = false;

                    }, 3000);
                }
                

                
			    });

            });

        };

        $scope.updateMap = function() {

        	$http.get('/map').success(function(data) {
                

        	});

        };
        
	}]);

    function initMap() {
        console.log("I'm initing a google map!");
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 28.5383, lng: -81.3792},
          scrollwheel: false,
          zoom: 15
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here!');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
      

      // $scope.getMapKey = function() {
      //       $http.get('/mapkey').success(function(data) {
      //           console.log(data);
      //           $scope.mapKey = "https://maps.googleapis.com/maps/api/js?key=" + data + "&callback=initMap";
      //           $scope.initMap();
      //       });
      //   };

      //   $scope.getMapKey();
      