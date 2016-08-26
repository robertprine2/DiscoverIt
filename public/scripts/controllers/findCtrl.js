angular.module('app')
	.controller('findCtrl', function($scope, $http) {
        $scope.title = "Find It!";
        $scope.discoveries = [];
        $http.get('/find').success(function(data) {
        	$scope.discoveries = data;
        });
	});