var app = angular.module('beerList', ['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: 'MainCtrl'
    })
    .state('beer', {
      url: '/beers/:id',
      templateUrl: '/templates/beer.html',
      controller: 'BeersCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/templates/register.html',
      controller: 'AuthCtrl'
    })
    .state('login', {
      url:'/login',
      templateUrl:'/templates/login.html',
      controller:'AuthCtrl'
    });
    .state('logout', {
      url:'/logout',
      templateUrl: '/templates/home.html',
      controller: 'MainCtrl'
    })

  $urlRouterProvider.otherwise('home');
}]);