var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider.
  when("/", {
    templateUrl : "home.html"
  })
  .when("/home", {
    templateUrl : "home.html"
  })
  .when("/competitions", {
    templateUrl : "competitions.html"
  })
  .when("/leaderboard", {
    templateUrl : "leaderboard.html"
  });
});
