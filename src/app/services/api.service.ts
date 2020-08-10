import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../configuration/config';

@Injectable()
export class ApiService {

    constructor(
        public httpClient: HttpClient,
        public urlObject: Configuration,
    ) { }

    /**
    * @method loginApi()
    * @desc check if user is authenticated or not
    */

    loginApi(loginInfoObj) {
        return this.httpClient.post(this.urlObject.UrlObj.loginApi, loginInfoObj);
    }

}