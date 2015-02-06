/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="services/todoCrudSrvc.ts" />
/// <reference path="controllers/todolistCtrl.ts" />
interface ITodo extends ng.resource.IResource<ITodo> {
  id: number;
  description: string;
  memo: string;
}

interface ITodoResource extends ng.resource.IResourceClass<ITodo> {
  update(todo : ITodo) : ITodo;
}

angular.module('appTypescript', ['ngRoute', 'ngResource']);

angular.module('appTypescript')
  .service('TodoCrudSrvc', ['$resource', TodoCrudSrvc])
  .controller('TodoListCtrl', ['TodoCrudSrvc', TodoListCtrl])
  .controller('TodoDetailCtrl', ['$location', 'TodoCrudSrvc', 'Todo', TodoDetailCtrl])
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
            function($route : ng.route.IRouteService, TodoCrudSrvc : TodoCrudSrvc) : ITodo {
              return TodoCrudSrvc.fetchTodo(<ITodo>{id: $route.current.params.id});
          }]
        }
      })
      .otherwise({redirectTo: '/'});
  }]);
