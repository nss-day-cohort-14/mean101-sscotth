'use strict'

const socket = io()
socket.on('connect', () => console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect', () => console.log('Socket disconnected'))

angular
  .module('mean101', ['ngRoute'])
  .config(($routeProvider, $locationProvider) => {
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'partials/main.html',
      })
      .when('/chat', {
        controller: 'ChatCtrl',
        templateUrl: 'partials/chat.html',
      })

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
    })
  })
  .controller('MainCtrl', function ($scope, $http) {
    $http
      .get('/api/title')
      .then(({ data: { title }}) =>
        $scope.title = title
      )
  })
  .controller('ChatCtrl', function ($scope, $http) {
    $scope.sendMessage = () => {
      const msg = {
        author: $scope.author,
        content: $scope.content,
      }

      $http
        .post('/api/messages', msg)
        .then(() => $scope.messages.push(msg))
        .catch(console.error)
    }

    $http
      .get('/api/messages')
      .then(({ data: { messages }}) =>
        $scope.messages = messages
      )
  })
