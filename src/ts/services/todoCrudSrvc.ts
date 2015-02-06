/// <reference path="../../../interfaces.d.ts" />

// can't wait for https://github.com/Microsoft/TypeScript/issues/206
// (function() {

module app {
  'use strict';

  class TodoCrudSrvc implements ITodoCrudSrvc {
    private _TodoList: ITodoResource;

    constructor($resource: ng.resource.IResourceService) {
      this._TodoList = <ITodoResource> $resource('/api/todos/:id', {id: '@id'}, {
        update: {method: 'PUT'}
      });
    }

    public fetchTodos(): ng.resource.IResourceArray<ITodo> {
      return this._TodoList.query();
    }

    public fetchTodo(todo: ITodo): ITodo {
      return this._TodoList.get({id: todo.id});
    }

    public createTodo(todo: ITodo): ITodo {
      return this._TodoList.save(todo);
    }

    public updateTodo(todo: ITodo): ITodo {
      return this._TodoList.update(todo);
    }

    public getNewTodo(): ITodo {
      return new this._TodoList();
    }
  }

  angular.module('appTypescript').service('TodoCrudSrvc', ['$resource', TodoCrudSrvc]);

}
// })();
