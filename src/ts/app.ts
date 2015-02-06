/// <reference path="../../interfaces.d.ts" />

import angular from './libs/angular';
import angularRoute from './libs/angularRoute';
import angularResource from './libs/angularResource';
import TodoCrudSrvc from './services/todoCrudSrvc';
import * as controllers from './controllers/todolistCtrl';

'use strict';
var app: ng.IModule = angular.module('appTypescript', [angularRoute, angularResource]);

/* tslint:disable:no-var-requires */
require('../partials/todolist.html');
require('../partials/todo-detail.html');
/* tslint:enable:no-var-requires */

app
  .service('TodoCrudSrvc', ['$resource', TodoCrudSrvc])
  .controller('TodoListCtrl', ['TodoCrudSrvc', controllers['default']])
  .controller('TodoDetailCtrl', ['$location', 'TodoCrudSrvc', 'Todo', controllers.TodoDetailCtrl])
  .config(['$routeProvider', ($routeProvider : ng.route.IRouteProvider): void => {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/todolist.html',
        controller: 'TodoListCtrl',
        controllerAs: 'todolist'
      })
      .when('/todo/:id', {
        templateUrl: '/partials/todo-detail.html',
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

export = app;
