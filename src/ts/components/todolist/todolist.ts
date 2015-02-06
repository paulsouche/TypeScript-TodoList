/// <reference path="../../../../interfaces.d.ts" />
import {
  Component,
  View,
  CORE_DIRECTIVES,
  FORM_DIRECTIVES,
  Inject,
  ControlGroup,
  FormBuilder,
  Validators
} from 'angular2/angular2';
import { RouterLink } from 'angular2/router';
import { TodoCrudSrvc } from '../../services/todoCrudSrvc';

@Component({
  selector: 'todolist',
  providers: [TodoCrudSrvc]
})
@View({
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, RouterLink],
  templateUrl: 'js/components/todolist/todolist.html'
})
export class Todolist {
  public todos: ITodo[];
  public newTodo: ITodo;
  public todoForm: ControlGroup;
  private _TodoCrudSrvc: TodoCrudSrvc;

  constructor( @Inject(TodoCrudSrvc) TodoCrudSrvc: TodoCrudSrvc,  @Inject(FormBuilder)FormBuilder: FormBuilder) {
    this._TodoCrudSrvc = TodoCrudSrvc;
    this.todoForm = FormBuilder.group({
      description: ['', Validators.required]
    });
    this.initNewTodo();
    this.getTodos();
  }

  public getTodos(): void {
    this._TodoCrudSrvc.fetchTodos()
      .subscribe((todos: ITodo[]): void => {
        this.todos = todos;
      });
  }

  public initNewTodo(): void {
    this.newTodo = this._TodoCrudSrvc.getNewTodo();
  }

  public addTodo(): void {
    this._TodoCrudSrvc.createTodo(this.newTodo)
      .subscribe((newTodo: ITodo): void => {
        this.todos.push(newTodo);
        this.initNewTodo();
      });
  }

  public removeTodo(todo: ITodo): void {
    this._TodoCrudSrvc.deleteTodo(todo)
      .subscribe((): void => {
        var index: number = this.todos.indexOf(todo);
        if (index > -1) {
          this.todos.splice(index, 1);
        }
      });
  }
}
