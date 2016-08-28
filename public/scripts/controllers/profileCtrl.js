angular.module('app')
	.controller('profileCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.title = "Profile";
        $scope.user = {};
        $scope.getUserInfo = function() {
        	$http.get('/currentUser').success(function(data) {
	        	$scope.user = data;
	        	console.log(data);
	        	$scope.user.avatar = data[0].avatar;
	        	console.log($scope.user.avatar);
	        	$scope.user.userName = data[0].userName;
	        	$scope.user.discoveries = data[0].discoveries;
	        	console.log($scope.user.discoveries);
	        	$scope.user.edits = data[0].edits;
	        	$scope.user.confirms = data[0].confirms;
	        	$scope.user.points = data[0].points;
	        });
        };


        $scope.getUserInfo();
	}]);

