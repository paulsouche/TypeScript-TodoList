/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="services/todoCrudSrvc.ts" />
/// <reference path="controllers/todolistCtrl.ts" />
module app {
  'use strict';

  export interface ITodo extends ng.resource.IResource<ITodo> {
    id: number;
    description: string;
    memo: string;
  }

  export interface ITodoResource extends ng.resource.IResourceClass<ITodo> {
    update(todo : ITodo) : ITodo;
  }

  angular.module('appTypescript', ['ngRoute', 'ngResource']);

  angular.module('appTypescript')
    .service('TodoCrudSrvc', ['$resource', app.srvc.TodoCrudSrvc])
    .controller('TodoListCtrl', ['TodoCrudSrvc', app.ctrl.TodoListCtrl])
    .controller('TodoDetailCtrl', ['$location', 'TodoCrudSrvc', 'Todo', app.ctrl.TodoDetailCtrl])
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
              function($route : ng.route.IRouteService, TodoCrudSrvc : app.srvc.TodoCrudSrvc) : ITodo {
                return TodoCrudSrvc.fetchTodo(<ITodo>{id: $route.current.params.id});
            }]
          }
        })
        .otherwise({redirectTo: '/'});
    }]);
}
