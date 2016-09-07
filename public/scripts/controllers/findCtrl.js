var globalDiscoveries = [];

var modal = {};

angular.module('app')
	.controller('findCtrl', function($scope, $http, $uibModal, $log) {
        $scope.title = "Find It!";
        $scope.discoveries = [];

        $scope.modal = modal;

        $scope.$watch('modal',function(newVal,oldVal){

		    console.log(newVal); //here you can get new modal value;
		    $scope.modal = newVal;
		    console.log($scope.modal); 

		},true);

  //       $scope.modal = $scope.$watch(function watchFunction(scope) {
		//     return modal
		// });
		// console.log("modal? " + $scope.modal);

        $scope.getDiscoveries = function() {
        	$http.get('/find').success(function(data) {
	        	
	        	for (var i = 0; i < data.length; i++) {
	        		var discovery = {};
	        		discovery.image = data[i].image;
	        		discovery.name = data[i].name;
	        		discovery.objectType = data[i].objectType;
	        		discovery.description = data[i].description;
	        		discovery.discoveredBy = data[i].user;
	        		discovery.discoveredOn = data[i].discoveredOn;
	        		discovery.location = data[i].location;
	        		
	        		$scope.discoveries.push(discovery);

	        	} // end of for loop

	        	globalDiscoveries = $scope.discoveries;
	        	console.log($scope.discoveries);
	        });
        };

        $scope.getDiscoveries();

        $scope.discoveryModal = function (size, discoveryData) {

		    var modalInstance = $uibModal.open({
		      //animation: this.animationsEnabled,
		      windowClass : 'show',
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'findItModal.html',
		      controller: function ($scope, $uibModalInstance, discoveryData) {
		      	  $scope.discoveryData = discoveryData;
		      	  console.log(discoveryData);
		      },
		      // controllerAs: 'this',
		      size: size,
		      resolve: {
		        discoveryData: function () {
		        	console.log(discoveryData);
		          	return discoveryData;
		        }
		      }
		    });

		    modalInstance.result.then(function (selectedItem) {
		      this.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
	  	};

        
	});

	function initMap() {
        
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 28.5383, lng: -81.3792},
          scrollwheel: false,
          zoom: 15
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here!');
            map.setCenter(pos);

            for (i = 0; i < globalDiscoveries.length; i++) {
				var marker = new google.maps.Marker({
					position: globalDiscoveries[i].location,
					map: map,
					title: globalDiscoveries[i].name,
					icon: {
					    url: globalDiscoveries[i].image, // url
					    scaledSize: new google.maps.Size(50, 50), // scaled size
					    origin: new google.maps.Point(0,0), // origin
					    anchor: new google.maps.Point(0, 0) // anchor
					},
					custom_param: globalDiscoveries[i].image
				});

				marker.addListener('click', function() {
            		var image = marker.custom_param;
            		
            		$.post('/findImage', {image: image}, function(data) {
            			console.log(data);
            			modal.image = data[0].image;
            			modal.name = data[0].name;
            			modal.description = data[0].description;
            			modal.discoveredOn = data[0].discoveredOn;
            			console.log(modal);
            		});

            		// targets hidden a tag to open modal
            		angular.element('#myModalShower').trigger('click');
            		// $('#myModal').modal('show');

            	});
            }

          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }