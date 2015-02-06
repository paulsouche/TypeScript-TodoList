/// <reference path="typings/tsd.d.ts" />

declare module "ngRoute" {
    var ngRoute: ng.IAngularStatic;
    export = ngRoute;
}

declare module "ngResource" {
    var ngResource: ng.IAngularStatic;
    export = ngResource;
}

interface IApp extends ng.IModule {
  init (): void;
}

interface ITodo extends ng.resource.IResource<ITodo> {
  id: number;
  description: string;
  memo: string
}

interface ITodoResource extends ng.resource.IResourceClass<ITodo> {
  update(todo : ITodo) : ITodo;
}

interface ITodoCrudSrvc {
  fetchTodos () : ng.resource.IResourceArray<ITodo>;
  fetchTodo (todo : ITodo) : ITodo;
  createTodo (todo : ITodo) : ITodo;
  updateTodo (todo : ITodo) : ITodo;
  getNewTodo () : ITodo
}

interface ITodoListCtrl {
  todos: ng.resource.IResourceArray<ITodo>;
  newTodo: ITodo;
  resourceTodolist: ITodoResource;
  removeTodo(todo: ITodo) : Array<ITodo>;
  createTodo(todo: ITodo) : ng.IPromise<ITodo>;
}

interface ITodoDetailCtrl {
  Todo: ITodo;
  updateTodo(): any;
}
