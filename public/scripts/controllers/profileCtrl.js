angular.module('app')
	.controller('profileCtrl', ['$scope', function($scope) {
        $scope.title = "Profile";
        $scope.items = ['Profile', 'Discover It!', 'Find It!'];
	}]);

