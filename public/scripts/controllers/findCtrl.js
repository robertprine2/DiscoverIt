angular.module('app')
	.controller('findCtrl', function($scope, $http) {
        $scope.title = "Find It!";
        $scope.discoveries = [];
        $scope.getDiscoveries = function() {
        	$http.get('/find').success(function(data) {
	        	
	        	for (var i = 0; i < data.length; i++) {
	        		var discovery = {};
	        		discovery.image = data[i].image;
	        		discovery.name = data[i].name;
	        		discovery.objectType = data[i].objectType;
	        		discovery.description = data[i].description;
	        		discovery.discoveredBy = data[i].user;
	        		discovery.discoveredOn = data[i].discoveredOn;
	        		
		        	$scope.discoveries.push(discovery)
	        	} // end of for loop
	        
	        });
        };

        $scope.getDiscoveries();

	});