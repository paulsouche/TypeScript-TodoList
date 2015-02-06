/// <reference path="../../../interfaces.d.ts" />

// can't wait for https://github.com/Microsoft/TypeScript/issues/206
// (function() {

module app {
  'use strict';

  class TodoListCtrl {
    public todos: ng.resource.IResourceArray<ITodo>;
    public newTodo: ITodo;
    public resourceTodolist: ITodoResource;
    private _TodoCrud: ITodoCrudSrvc;

    constructor(TodoCrudSrvc: ITodoCrudSrvc) {
      this._TodoCrud = TodoCrudSrvc;
      this.todos = TodoCrudSrvc.fetchTodos();
      this.newTodo = TodoCrudSrvc.getNewTodo();
    }

    public removeTodo(todo: ITodo): Array<ITodo> {
      todo.$delete();
      return this.todos.splice(this.todos.indexOf(todo), 1);
    }

    public createTodo(): ng.IPromise<ITodo> {
      var _self: TodoListCtrl = this;
      return this.newTodo.$save()
        .then(function (todo: ITodo): any {
          _self.todos.push(todo);
          _self.newTodo = _self._TodoCrud.getNewTodo();
        });
    }
  }

  class TodoDetailCtrl {
    public Todo: ITodo;
    private _TodoCrud: ITodoCrudSrvc;
    private _location: ng.ILocationService;

    constructor($location: ng.ILocationService, TodoCrudSrvc: ITodoCrudSrvc, Todo: ITodo) {
      this._location = $location;
      this._TodoCrud = TodoCrudSrvc;
      this.Todo = Todo;
    }

    public updateTodo(): any {
      this._TodoCrud.updateTodo(this.Todo);
      this._location.path('/');
    }
  }

  angular.module('appTypescript').controller('TodoListCtrl', ['TodoCrudSrvc', TodoListCtrl]);
  angular.module('appTypescript').controller('TodoDetailCtrl', ['$location', 'TodoCrudSrvc', 'Todo', TodoDetailCtrl]);

}
// })();
