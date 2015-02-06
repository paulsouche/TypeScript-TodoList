/// <reference path="../../../interfaces.d.ts"/>"

import { Injectable, Inject } from 'angular2/angular2';
import { Http, Response, Headers } from 'angular2/http';

@Injectable()
export class TodoCrudSrvc {
  public static TODOS_URL = 'api/todos';
  private _http: Http;
  constructor( @Inject(Http) http: Http) {
    this._http = http;
  }

  public fetchTodos(): any {
    return this._http.get(TodoCrudSrvc.TODOS_URL)
      .map((res: Response): ITodo[] => { return <ITodo[]>res.json(); });
  }

  public createTodo(todo: ITodo): any {
    return this._http.post(TodoCrudSrvc.TODOS_URL, JSON.stringify(todo), {
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
      .map((res: Response): ITodo => { return <ITodo>res.json(); });
  }

  public fetchTodo(id: string): any {
    return this._http.get([TodoCrudSrvc.TODOS_URL, id].join('/'))
      .map((res: Response): ITodo => { return <ITodo>res.json(); });
  }

  public updateTodo(todo: ITodo): any {
    return this._http.put([TodoCrudSrvc.TODOS_URL, todo.id].join('/'), JSON.stringify(todo), {
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
      .map((res: Response): ITodo => { return <ITodo>res.json(); });
  }

  public deleteTodo(todo: ITodo): any {
    return this._http.delete([TodoCrudSrvc.TODOS_URL, todo.id].join('/'));
  }

  public getNewTodo(): ITodo {
    return {
      id: null,
      description: '',
      memo: ''
    };
  }
}
