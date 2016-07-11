/* Avoid: 'error TS2304: Cannot find name <type>' during compilation */
///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>
// ///<reference path="../../typings/jwt_decode.d.ts"/>

import { bootstrap } from '@angular/platform-browser-dynamic';
import { provide } from '@angular/core';
import { FORM_PROVIDERS } from '@angular/common';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { App } from './app/app';

bootstrap(
    App,
    [
        FORM_PROVIDERS,
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        provide(AuthHttp, {
            useFactory: (http) => {
                return new AuthHttp(new AuthConfig({
                    tokenName: 'jwt'
                }), http);
            },
            deps: [Http]
        })
    ]
);