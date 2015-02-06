
module app {
  'use strict';
  export module ctrl {
    export class TodoListCtrl {
      public todos : ng.resource.IResourceArray<ITodo>;
      public newTodo : ITodo;
      public resourceTodolist : ITodoResource;
      private _TodoCrud: app.srvc.TodoCrudSrvc;
      constructor(TodoCrudSrvc : app.srvc.TodoCrudSrvc) {
        this._TodoCrud = TodoCrudSrvc;
        this.todos = TodoCrudSrvc.fetchTodos();
        this.newTodo = TodoCrudSrvc.getNewTodo();
      }
      public removeTodo(todo : ITodo) : Array<ITodo> {
        todo.$delete();
        return this.todos.splice(this.todos.indexOf(todo), 1);
      }
      public createTodo() : ng.IPromise<ITodo> {
        var _self : TodoListCtrl = this;
        return this.newTodo.$save()
          .then(function(todo : ITodo) : any {
            _self.todos.push(todo);
            _self.newTodo = _self._TodoCrud.getNewTodo();
          });
      }
    }

    export class TodoDetailCtrl {
      public Todo : ITodo;
      private _TodoCrud : app.srvc.TodoCrudSrvc;
      private _location : ng.ILocationService;
      constructor($location : ng.ILocationService, TodoCrudSrvc : app.srvc.TodoCrudSrvc, Todo : ITodo) {
        this._location = $location;
        this._TodoCrud = TodoCrudSrvc;
        this.Todo = Todo;
      }
      public updateTodo () : any {
        this._TodoCrud.updateTodo(this.Todo);
        this._location.path('/');
      }
    }
  }
}
