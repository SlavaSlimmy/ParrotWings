import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router-deprecated';
import { AuthHttp } from 'angular2-jwt';
import { contentHeaders } from '../common/headers';
import { Transaction } from '../common/transaction';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TransactionService {
    constructor(private authHttp:AuthHttp) {}

    private transactionUrl = 'http://localhost:3001/api/protected/transactions';

    getTransactions(): Observable<Transaction[]> {
        return this.authHttp.get(this.transactionUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    addTransaction(name: string, amount: number): Observable<Transaction> {
        let body = JSON.stringify({ name, amount});
        return this.authHttp.post(this.transactionUrl, body, { headers: contentHeaders })
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json().trans_token;
        return body || { };
    }

    private handleError (error: any) {
        let errMsg = (error._body) ? error._body :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
}
