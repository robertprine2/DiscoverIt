angular.module('app')
	.controller('discoverCtrl', ['$scope', '$http', function($scope, $http, $log) {
        $scope.title = "Discover It!";
        $scope.didItWork = "";
        $scope.objects = ['animal', 'art', 'food', 'landform', 'object', 'plant', 'pokemon', 'vehicle'];

        this.discovery = {};



     //    // function that allows users to take pictures with their camera as an input
     //    $scope.takePicture = (function () {
	    //     var takePicture = document.querySelector("#take-picture"),
	    //         showPicture = document.querySelector("#show-picture");

	    //     if (takePicture && showPicture) {
	    //         // Set events
	    //         takePicture.onchange = function (event) {
	    //             // Get a reference to the taken picture or chosen file
	    //             var files = event.target.files,
	    //                 file;
	    //             if (files && files.length > 0) {
	    //                 file = files[0];
	    //                 try {
	    //                     // Create ObjectURL
	    //                     var imgURL = window.URL.createObjectURL(file);

	    //                     // Set img src to ObjectURL
	    //                     showPicture.src = imgURL;

	    //                     // Revoke ObjectURL
	    //                     URL.revokeObjectURL(imgURL);
	    //                 }
	    //                 catch (e) {
	    //                     try {
	    //                         // Fallback if createObjectURL is not supported
	    //                         var fileReader = new FileReader();
	    //                         fileReader.onload = function (event) {
	    //                             showPicture.src = event.target.result;
	    //                         };
	    //                         fileReader.readAsDataURL(file);
	    //                     } // end of try
	    //                     catch (e) {
	    //                         //
	    //                         var error = document.querySelector("#error");
	    //                         if (error) {
	    //                             error.innerHTML = "Neither createObjectURL or FileReader are supported";
	    //                         } // end of if
	    //                     } // end of catch (e)
	    //                 } // end of catch (e)
	    //             } // end of if files && file length > 0
	    //         }; // end of takePicture.onchange function
	    //     } // end of if (takePicture && showPIcture)
	    // })(); // end of function for picture input

        $scope.addDiscovery = function() {
        	this.discovery.image = "";
        	this.discovery.location = ""/*gps api call*/;
        	this.discovery.discoveredOn = Date.now();
        	
        	$http.post('/discover', {discovery: this.discovery}).success(function(data) {
        		$scope.didItWork = "You discovered it!";
        	});
        	this.discovery = {};
        };
	}]);