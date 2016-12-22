app.factory('beers', ['$http', function ($http) {
  var beerService = {
    beers: []
  };

  beerService.getAll = function () {
    return $http.get('/beers').then(function(data) {
      // this copies the response posts to the client side
      // 'beers' under 'beerService'
      angular.copy(data.data, beerService.beers);
    });
  };

  beerService.create = function (beer) {
    return $http.post('/beers', beer).then(function(data){
      console.log(data);
      beerService.beers.push(data.data);
    });
  };

  beerService.delete = function (beer) {
    $http.delete('/beers/' + beer._id).then(function (data) {
      for (var i = 0; i < beerService.beers.length; i += 1) {
        if (beerService.beers[i]._id === beer._id) {
          beerService.beers.splice(i, 1);
        }
      }
    });
  };

  beerService.findById = function (id) {
    for (var i = 0; i < beerService.beers.length; i += 1) {
      if (beerService.beers[i]._id === id) {
        return beerService.beers[i];
      }
    }
  };

  beerService.addReview = function(id, review) {
    return $http.post('/beers/' + id + '/reviews', review);
  };

  beerService.deleteReview = function(reviewId, beerId) {
    $http.delete('/beers/' + beerId + '/reviews/' + reviewId).then(function () {
        var beer = beerService.findById(beerId);

        for (var i = 0; i < beer.reviews.length; i += 1) {
          if (beer.reviews[i]._id === reviewId) {
            beer.reviews.splice(i, 1);
          }
        }
      });
  };

  return beerService;
}]);