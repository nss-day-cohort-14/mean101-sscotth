'use strict'

angular
  .module('mean101', ['ngRoute'])
  .config($routeProvider =>
    $routeProvider
      .when('/', {
        controller: 'main',
        templateUrl: 'partials/main.html',
      })
  )
  .controller('main', function ($scope, $http) {
    $http
      .get('/api/title')
      .then(({ data: { title }}) =>
        $scope.title = title
      )
  })
