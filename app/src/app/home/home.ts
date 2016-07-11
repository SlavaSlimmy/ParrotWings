import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { Router } from '@angular/router-deprecated';
import { History } from '../history/history';
import { UserService } from '../services/user';
import { UserInfo } from '../common/user-info';
import '../common/rxjs-operators';

@Component({
  selector: 'home',
  directives: [CORE_DIRECTIVES, History],
  providers: [UserService],
  templateUrl: './app/home/home.html'
})

export class Home {
  jwt: string;
  decodedJwt: string;
  username: string;
  balance: number;
  errorMessage: string;

  constructor(public router: Router, public userService: UserService) {
    this.jwt = localStorage.getItem('jwt');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);

    this.getUserInfo();
  }

  getUserInfo() {
    this.userService.getUserInfo()
        .subscribe(
            userInfo => {this.userInfo = userInfo , this.initUserInfo(); },
            error =>  this.errorMessage = <any>error);
  }

  initUserInfo() {
    this.username = this.userInfo.name;
    this.balance = this.userInfo.balance;
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.parent.navigateByUrl('/login');
  }

  balanceChange(event) {
    this.getUserInfo();
  }
}
