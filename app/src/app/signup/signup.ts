import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router-deprecated';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';

@Component({
  selector: 'signup',
  directives: [ RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES ],
  templateUrl: './app/signup/signup.html'
})
export class Signup {
  errorMessage: string;

  constructor(public router: Router, public http: Http) {}

  signup(event, username, email, password, repassword) {
    event.preventDefault();
    if (!this.checkFields(username, password, repassword)) { return; }
    let body = JSON.stringify({ username, password, email });
    this.http.post('http://localhost:3001/users', body, { headers: contentHeaders })
      .subscribe(
        response => {
          localStorage.setItem('jwt', response.json().id_token);
          this.router.parent.navigateByUrl('/home');
        },
        error => {
          this.errorMessage = error.text();
        }
      );
  }

  checkFields(username, password, repassword) {
    if (username.length < 5) {
      this.errorMessage = "The name must be more than 5 letters.";
      return false;
    }
    if (password.length < 6) {
      this.errorMessage = "The password must be more than 6 symbols.";
      return false;
    }
    if (password !== repassword) {
      this.errorMessage = "Passwords do not match.";
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  login(event) {
    event.preventDefault();
    this.router.parent.navigateByUrl('/login');
  }

}
