var app = angular.module('app', ['ui.bootstrap']).controller('indexCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;



  $scope.addSlide = function() {

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

        for (var i = 0; i < 4; i++) {
            var discovery = {};
            var randNum = Math.floor(Math.random() * discoveries.length);
            slides.push({
                image = discoveries[randNum].image,
                name = discoveries[randNum].name,
                objectType = discoveries[randNum].objectType,
                description = discoveries[randNum].description,
                discoveredBy = discoveries[randNum].user,
                discoveredOn = discoveries[randNum].discoveredOn,
                location = discoveries[randNum].location
            });
        }

    });

    

    // var newWidth = 600 + slides.length + 1;
    // slides.push({
    //   image: '//unsplash.it/' + newWidth + '/300',
    //   // image: '../../images/jumbotron.jpg',
    //   text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
    //   id: currIndex++
    // });
  };

  $scope.randomize = function() {
    var indexes = generateIndexesArray();
    assignNewIndexesToSlides(indexes);
  };

  for (var i = 0; i < 4; i++) {
    $scope.addSlide();
  }

  // Randomize logic below

  function assignNewIndexesToSlides(indexes) {
    for (var i = 0, l = slides.length; i < l; i++) {
      slides[i].id = indexes.pop();
    }
  }

  function generateIndexesArray() {
    var indexes = [];
    for (var i = 0; i < currIndex; ++i) {
      indexes[i] = i;
    }
    return shuffle(indexes);
  }

  // http://stackoverflow.com/questions/962802#962890
  function shuffle(array) {
    var tmp, current, top = array.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    }

    return array;
  }


    

}]);