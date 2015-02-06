import { bootstrap, View, Component, Inject, bind, FORM_PROVIDERS } from 'angular2/angular2';
import { RouteConfig, ROUTER_DIRECTIVES, Router, ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { Todolist } from './components/todolist/todolist';
import { TodoDetail } from './components/todo-detail/todoDetail';
import { TodoCrudSrvc } from './services/todoCrudSrvc';

@Component({
    selector: 'todolist-app'
})
@View({
    templateUrl: 'js/app.html',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/', redirectTo: '/todolist' },
    { path: '/todolist', as: 'Todolist', component: Todolist },
    { path: '/todolist/:id', as: 'TodoDetail', component: TodoDetail }
])
class App {
    constructor(@Inject(Router)router: Router) {
      console.log(router);
    }
}
bootstrap(App, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  FORM_PROVIDERS,
  TodoCrudSrvc,
  bind(LocationStrategy).toClass(HashLocationStrategy)
]);
