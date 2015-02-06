/// <reference path="../../interfaces.d.ts" />

(function() {
  'use strict';

  angular.module('appTypescript', ['ngRoute', 'ngResource']);

  angular.module('appTypescript')
    .config(['$routeProvider', function($routeProvider : ng.route.IRouteProvider) : any {
      $routeProvider
        .when('/', {
          templateUrl: 'partials/todolist.html',
          controller: 'TodoListCtrl',
          controllerAs: 'todolist'
        })
        .when('/todo/:id', {
          templateUrl: 'partials/todo-detail.html',
          controller: 'TodoDetailCtrl',
          controllerAs: 'tododetail',
          resolve: {
            Todo: ['$route', 'TodoCrudSrvc',
              function($route : ng.route.IRouteService, TodoCrudSrvc : ITodoCrudSrvc) : ITodo {
                return TodoCrudSrvc.fetchTodo(<ITodo>{id: $route.current.params.id});
              }]
          }
        })
        .otherwise({redirectTo: '/'});
    }]);
})();
