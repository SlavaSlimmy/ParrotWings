import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router-deprecated';
import { AuthHttp } from 'angular2-jwt';
import { UserInfo } from '../common/user-info';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

    constructor(private authHttp:AuthHttp) {}

    private userInfoUrl = 'http://localhost:3001/api/protected/user-info';

    getUserInfo(): Observable<UserInfo> {
        return this.authHttp.get(this.userInfoUrl)
            .map(this.extractUserInfo)
            .catch(this.handleError);
    }

    private extractUserInfo(res: Response) {
        let body = res.json().user_info_token;
        return body || { };
    }

    private handleError (error: any) {
        let errMsg = (error._body) ? error._body :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
}