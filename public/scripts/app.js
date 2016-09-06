var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAnimate'])
    .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('profile', {
            url: '/',
            templateUrl: 'views/profile.html',
            controller: 'profileCtrl'
        })
        .state('discover', {
            url: '/discover',
            templateUrl: 'views/discover.html',
            controller: 'discoverCtrl'
        })
        .state('find', {
            url: '/find',
            templateUrl: 'views/find.html',
            controller: 'findCtrl'
        })
        .state('index', {
            url: '/index',
            templateUrl: 'views/index.html',
            controller: 'indexCtrl'
        })

}]);

