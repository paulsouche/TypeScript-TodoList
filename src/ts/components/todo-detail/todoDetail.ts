import {
  Component,
  View,
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  Inject,
  ControlGroup,
  FormBuilder,
  Validators
} from 'angular2/angular2';
import { Router, RouteParams } from 'angular2/router';
import { TodoCrudSrvc } from '../../services/TodoCrudSrvc';

@Component({
  selector: 'todo-detail',
  providers: [TodoCrudSrvc]
})
@View({
  templateUrl: 'js/components/todo-detail/todo-detail.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES ]
})
export class TodoDetail {
  public todo: ITodo;
  public todoForm: ControlGroup;

  private _Router: Router;
  private _RouteParams: RouteParams;
  private _FormBuilder: FormBuilder;
  private _TodoCrudSrvc: TodoCrudSrvc;

  constructor(
    @Inject(Router)Router: Router,
    @Inject(RouteParams)RouteParams: RouteParams,
    @Inject(FormBuilder)FormBuilder: FormBuilder,
    @Inject(TodoCrudSrvc)TodoCrudSrvc: TodoCrudSrvc) {
      this._Router = Router;
      this._RouteParams = RouteParams;
      this._FormBuilder = FormBuilder;
      this._TodoCrudSrvc = TodoCrudSrvc;
      this.initTodo();
      this.initForm(this.todo);
  }

  public initTodo(): void {
    this.todo = this._TodoCrudSrvc.getNewTodo();
    this._TodoCrudSrvc.fetchTodo(this._RouteParams.get('id'))
      .subscribe((todo: ITodo): void => {
        this.todo = todo;
      });
  }

  public initForm(todo: ITodo): void {
    this.todoForm = this._FormBuilder.group({
      description: [todo.description, Validators.required],
      memo: [todo.memo]
    });
  }

  public updateTodo () : any {
    this._TodoCrudSrvc.updateTodo(this.todo)
      .subscribe(() : void => {
        var instruction = this._Router.generate(['/Todolist']);
        this._Router.navigateByInstruction(instruction);
      });
  }
}
