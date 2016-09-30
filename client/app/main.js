'use strict'

angular
  .module('mean101', ['ngRoute'])
  .factory('socket', () => {
    const socket = io()

    socket.on('connect', () => console.log(`Socket connected: ${socket.id}`))
    socket.on('disconnect', () => console.log('Socket disconnected'))
    socket.on('error', err => console.error('Error received', err))

    return socket
  })
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
  .controller('ChatCtrl', function ($scope, $http, socket) {
    $scope.sendMessage = () => {
      const msg = {
        author: $scope.author,
        content: $scope.content,
      }

      if (socket.connected) {
        return socket.emit('postMessage', msg)
      }

      $http
        .post('/api/messages', msg)
        .then(() => $scope.messages.push(msg))
        .catch(console.error)
    }

    // populate initial messages
    $http
      .get('/api/messages')
      .then(({ data: { messages }}) =>
        $scope.messages = messages
      )

    // receive new messages
    socket.on('getNewMessage', msg => {
      $scope.messages.push(msg)
      $scope.$apply()
    })
  })
