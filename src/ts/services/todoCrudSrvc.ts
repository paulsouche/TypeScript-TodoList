
module app {
  'use strict';
  export module srvc {
    export class TodoCrudSrvc {
      private _TodoList : ITodoResource;
      constructor($resource : ng.resource.IResourceService) {
        this._TodoList = <ITodoResource> $resource('/api/todos/:id', {id: '@id'}, {
          update: {method: 'PUT'}
        });
      }
      public fetchTodos () : ng.resource.IResourceArray<ITodo> {
        return this._TodoList.query();
      }
      public fetchTodo (todo : ITodo) : ITodo {
        return this._TodoList.get({id: todo.id});
      }
      public createTodo (todo : ITodo) : ITodo {
        return this._TodoList.save(todo);
      }
      public updateTodo (todo : ITodo) : ITodo {
        return this._TodoList.update(todo);
      }
      public getNewTodo () : ITodo {
        return new this._TodoList();
      }
    }
  }
}
