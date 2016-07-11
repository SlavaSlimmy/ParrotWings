import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Transaction } from '../common/transaction';
import { TransactionService } from '../services/transaction';
import { UserService } from '../services/user';
import { UserInfo } from '../common/user-info';
import { AutocompleteDirective } from "../common/autocomplete";
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { contentHeaders } from '../common/headers';

@Component({
    selector: 'history',
    templateUrl: './app/history/history.html',
    directives: [AutocompleteDirective],
    providers: [TransactionService]
})

export class History implements OnInit {
    errorMessage: string;
    approveMessage: string;
    transactions: Transaction[];
    userInfo: UserInfo;
    mode = 'Observable';

    refresh: boolean;

    isEmpty: boolean = true;

    public transName: string = "";
    public transAmount: string = "";
    private usersUrl = 'http://localhost:3001/api/protected/users/list';

    @Output() refreshBalance = new EventEmitter();

    constructor (private transactionService: TransactionService, public userService: UserService, private authHttp:AuthHttp) {
        this.refresh = false;
        this.userInfo = this.getUserInfo();
    }


    ngOnInit() {
        this.getTransactions();
    }

    getTransactions() {
        this.transactionService.getTransactions()
            .subscribe(
                transactions => {this.transactions = transactions, this.sort(this.transactions, 'date'); },
                error =>  this.errorMessage = <any>error);
    }

    addTransaction(event, name: string, amount: number) {
        event.preventDefault();
        if (!name) { return; }
        if (!this.checkAmount(amount)) { return; }
        this.transactionService.addTransaction(name, amount)
            .subscribe(
                transaction  => {this.transactions.push(transaction), this.initRefresh(); },
                error => {
                    this.approveMessage = "";
                    this.errorMessage = <any>error;
                }
            );
    }

    checkAmount(amount) {
        this.approveMessage = "";
        if (!amount) {
            this.errorMessage = "You must enter PW amount.";
            return false;
        }
        if (!(!isNaN(parseFloat(amount)) && isFinite(amount))) {
            this.errorMessage = "Amount must be numeric.";
            return false;
        }
        if (amount <= 0) {
            this.errorMessage = "Amount must be more than 0.";
            return false;
        }
        if (amount > this.userInfo.balance) {
            this.errorMessage = "Not enough PW to remit the transaction.";
            return false;
        }
        this.errorMessage = "";
        return true;
    }

    getUserInfo() {
        this.userService.getUserInfo()
            .subscribe(
                userInfo => this.userInfo = userInfo,
                error =>  this.errorMessage = <any>error);
    }

    initRefresh() {
        this.approveMessage = "You successfully remit the transaction.";
        this.refresh = true;
        this.refreshBalance.emit({
            value: this.refresh
        });
        this.userInfo = this.getUserInfo();
        this.refresh = false;

        this.sort(this.transactions, 'date');

        this.transName = "";
        this.transAmount = "";
        this.isEmpty = true;
    }

    sort(transactions, type) {
        transactions.sort(function(a, b) {return (a[type] > b[type]) ? -1 : ((b[type] > a[type]) ? 1 : 0); } );
    }

    searchUser() {
        return (filter: string): Promise<Array<{ text: string, data: any }>> => {
            return new Promise<Array<{ text: string, data: any }>>((resolve, reject) => {
                this.authHttp.post(this.usersUrl, JSON.stringify({ filter }), { headers: contentHeaders })
                    .map(res => res.json())
                    .map(users => users.map((user: any) => {
                        return {text: user.name, data: user};
                    }))
                    .subscribe(
                        users => resolve(users),
                        err => reject(err)
                    );
            });
        };
    }

    public onItemSelected(selected: { text: string, data: any }) {
        this.transName = selected.text;
    }

    copyTrans(event, transaction) {
        event.preventDefault();
        this.transName = transaction.username;
        this.transAmount = (+transaction.amount < 0) ? -transaction.amount : transaction.amount;
        this.isEmpty = false;
    }
}