import * as ng from 'angular2/angular2';
import { TodoCrudSrvc } from '../ts/services/todoCrudSrvc';

var httpMock = jasmine.createSpyObj('http', ['delete']),
  todoCrudSrvc = new TodoCrudSrvc(httpMock);

describe('App typescript application', () => {

  it('should use angular 2', () => {
    expect(ng).toBeDefined();
  });

  it('should expose a TodoService', () => {
    expect(TodoCrudSrvc).toBeDefined();
  });

  it('should delete a todo', () => {
    var todo = todoCrudSrvc.getNewTodo();
    todo.id = 18;
    todoCrudSrvc.deleteTodo(todo);
    expect(httpMock.delete).toHaveBeenCalledWith([TodoCrudSrvc.TODOS_URL, todo.id].join('/'));
  });

});
