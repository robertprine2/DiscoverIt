angular.module('app')
	.controller('discoverCtrl', ['$scope', '$http', function($scope, $http, $log) {
        $scope.title = "Discover It!";
        $scope.didItWork = "";
        $scope.objects = ['animal', 'art', 'food', 'landform', 'object', 'plant', 'pokemon', 'vehicle'];

        $scope.addDiscovery = function() {
        	
        	cloudinary.openUploadWidget({ cloud_name: 'dfsidsh0y', upload_preset: 'exy3o3ab'}, 
            function(error, result) { 
                
                var imageUrl = result[0].secure_url;
                
                str = $('#objectType').val();
                
                var discovery = {};
        
                discovery.name = $('#name').val();
                discovery.objectType = str.substring(7, str.length);
                discovery.description = $('#description').val();
	        	discovery.image = imageUrl;
	        	discovery.location = ""/*gps api call*/;
	        	discovery.discoveredOn = Date.now();
	        	console.log(discovery);
	        	
	        	$http.post('/discover', {discovery: discovery}).then(function(data) {
	        			console.log(data);
			            $scope.didItWork = "You discovered it!";
			    });

            });

        };

        $scope.updateMap = function() {

        	$http.get('/map').success(function(data) {



        	});

        };

	}]);

