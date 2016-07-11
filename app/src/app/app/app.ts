import {Component} from '@angular/core';
import {RouteConfig, RouterLink, Router} from '@angular/router-deprecated';

import {LoggedInRouterOutlet} from './LoggedInOutlet';
import {Home} from '../home/home';
import {Login} from '../login/login';
import {Signup} from '../signup/signup';

@Component({
  selector: 'app',
  templateUrl: './app/app/app.html',
  directives: [ LoggedInRouterOutlet ]
})
@RouteConfig([
  { path: '/', redirectTo: ['/Home'] },
  { path: '/home', component: Home, as: 'Home' },
  { path: '/login', component: Login, as: 'Login' },
  { path: '/signup', component: Signup, as: 'Signup' }
])

export class App {
  constructor(public router: Router) {
  }
}
