var app = angular.module('app', ['ui.router'])
    .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('profile', {
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

}]);

// $(document).ready(function(){

//     // function that allows users to take pictures with their camera as an input
//     (function () {
//         var takePicture = document.querySelector("#take-picture"),
//             showPicture = document.querySelector("#show-picture");

//         if (takePicture && showPicture) {
//             // Set events
//             takePicture.onchange = function (event) {
//                 // Get a reference to the taken picture or chosen file
//                 var files = event.target.files,
//                     file;
//                 if (files && files.length > 0) {
//                     file = files[0];
//                     try {
//                         // Create ObjectURL
//                         var imgURL = window.URL.createObjectURL(file);

//                         // Set img src to ObjectURL
//                         showPicture.src = imgURL;

//                         // Revoke ObjectURL
//                         URL.revokeObjectURL(imgURL);
//                     }
//                     catch (e) {
//                         try {
//                             // Fallback if createObjectURL is not supported
//                             var fileReader = new FileReader();
//                             fileReader.onload = function (event) {
//                                 showPicture.src = event.target.result;
//                             };
//                             fileReader.readAsDataURL(file);
//                         } // end of try
//                         catch (e) {
//                             //
//                             var error = document.querySelector("#error");
//                             if (error) {
//                                 error.innerHTML = "Neither createObjectURL or FileReader are supported";
//                             } // end of if
//                         } // end of catch (e)
//                     } // end of catch (e)
//                 } // end of if files && file length > 0
//             }; // end of takePicture.onchange function
//         } // end of if (takePicture && showPIcture)
//     })(); // end of function for picture input

    

// }); // end of document.ready