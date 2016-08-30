angular.module('app')
	.controller('discoverCtrl', ['$scope', '$http', function($scope, $http, $log) {
        $scope.title = "Discover It!";
        $scope.didItWork = "";
        $scope.objects = ['animal', 'art', 'food', 'landform', 'object', 'plant', 'pokemon', 'vehicle'];

        this.discovery = {};
        var self = this;



        // function that allows users to take pictures with their camera as an input
        $scope.takePicture = function () {
	        var takePicture = document.querySelector("#take-picture"),
	            showPicture = document.querySelector("#show-picture");

	        if (takePicture && showPicture) {
	            // Set events
	            takePicture.onchange = function (event) {
	                // Get a reference to the taken picture or chosen file
	                var files = event.target.files,

	                    file;
	                console.log(files);
	                if (files && files.length > 0) {
	                    file = files[0].name;
	                    self.discovery.image = file;
	                    console.log(self.discovery);
	                    try {
	                    	console.log("made it here");
	                        // Create ObjectURL
	                        var imgURL = window.URL.createObjectURL(file);
	                        console.log(imgURL);
	                        // Set img src to ObjectURL
	                        showPicture.src = imgURL;

	                        // Revoke ObjectURL
	                        URL.revokeObjectURL(imgURL);
	                    }
	                    catch (e) {
	                        try {
	                        	console.log("made it here");
	                            // Fallback if createObjectURL is not supported
	                            var fileReader = new FileReader();
	                            fileReader.onload = function (event) {
	                            	console.log(event.target.result);
	                                showPicture.src = event.target.result;
	                            };
	                            fileReader.readAsDataURL(file);
	                        } // end of try
	                        catch (e) {
	                            //
	                            var error = document.querySelector("#error");
	                            if (error) {
	                            	console.log("aww crap!");
	                                error.innerHTML = "Neither createObjectURL or FileReader are supported";
	                            } // end of if
	                        } // end of catch (e)
	                    } // end of catch (e)
	                } // end of if files && file length > 0
	            }; // end of takePicture.onchange function
	        } // end of if (takePicture && showPIcture)
	    }; // end of function for picture input

        $scope.addDiscovery = function() {
        	
        	// this.discovery.image = $("#take-picture").val();
        	this.discovery.image = "./public/images/jumbotron.jpg";
        	this.discovery.location = ""/*gps api call*/;
        	this.discovery.discoveredOn = Date.now();
        	console.log(this.discovery);
        	
        	$http.post('/discover', {discovery: this.discovery}).then(function(data) {
        			console.log(data);
		            $scope.didItWork = "You discovered it!";
		       

        	});
        	this.discovery = {};
        };

        $scope.updateMap = function() {

        	$http.get('/map').success(function(data) {



        	});

        };

	}]);