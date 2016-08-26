angular.module('app')
	.controller('findCtrl', ['$scope', function($scope) {
        $scope.title = "Find It!";
        $scope.items = ['Profile', 'Discover It!', 'Find It!'];
	}]);