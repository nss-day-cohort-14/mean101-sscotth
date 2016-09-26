'use strict'

angular
  .module('mean101', ['ngRoute'])
  .config($routeProvider =>
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'partials/main.html',
      })
      .when('/chat', {
        controller: 'ChatCtrl',
        templateUrl: 'partials/chat.html',
      })
  )
  .controller('MainCtrl', function ($scope, $http) {
    $http
      .get('/api/title')
      .then(({ data: { title }}) =>
        $scope.title = title
      )
  })
  .controller('ChatCtrl', function ($scope, $http) {
    $http
      .get('/api/messages')
      .then(({ data: { messages }}) =>
        $scope.messages = messages
      )
  })
