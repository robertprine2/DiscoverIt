angular.module('app')
	.controller('discoverCtrl', ['$scope', function($scope) {
        $scope.title = "Discover It!";
        $scope.items = ['Profile', 'Discover It!', 'Find It!'];
	}]);