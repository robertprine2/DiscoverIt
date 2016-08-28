angular.module('app')
	.controller('profileCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.title = "Profile";
        $scope.user = {};
        $scope.getUserInfo = function() {
        	$http.get('/currentUser').success(function(data) {
	        	$scope.user = data;	        	
	        	$scope.user.avatar = data[0].avatar;	        	
	        	$scope.user.userName = data[0].userName;
	        	$scope.user.discoveries = data[0].discoveries;	        	
	        	$scope.user.edits = data[0].edits;
	        	$scope.user.confirms = data[0].confirms;
	        	$scope.user.points = data[0].points;
	        });
        };


        $scope.getUserInfo();
	}]);

