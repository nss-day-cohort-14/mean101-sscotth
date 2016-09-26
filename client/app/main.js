'use strict'

angular
  .module('mean101', [])
  .controller('main', function ($scope, $http) {
    $http
      .get('/api/title')
      .then(({ data: { title }}) =>
        $scope.title = title
      )
  })
