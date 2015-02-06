/// <reference path="../../interfaces.d.ts" />

import angular = require('angular');
import ngRoute = require('ngRoute');
import ngResource = require('ngResource');
import TodoCrudSrvc from './services/todoCrudSrvc';
import * as controllers from './controllers/todolistCtrl';

'use strict';
var app: IApp = <IApp>angular.module('appTypescript', [ngRoute.module('ngRoute').name, ngResource.module('ngResource').name]);

app.init = function () {
  angular.bootstrap(document, ['appTypescript']);
};

app
  .service('TodoCrudSrvc', ['$resource', TodoCrudSrvc])
  .controller('TodoListCtrl', ['TodoCrudSrvc', controllers['default']])
  .controller('TodoDetailCtrl', ['$location', 'TodoCrudSrvc', 'Todo', controllers.TodoDetailCtrl])
  .config(['$routeProvider', ($routeProvider : ng.route.IRouteProvider): void => {
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

export = app;
