import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../configuration/config';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiService {

    options: any;

    constructor(
        public httpClient: HttpClient,
        public urlObject: Configuration,
    ) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
    }

    /**
    * @method loginApi()
    * @desc check if user is authenticated or not
    */
    loginApi(loginInfoObj) {
        return this.httpClient.post(this.urlObject.UrlObj.loginApi, loginInfoObj);
    }

    /**
   * @method getConstants()
   * @desc get constants
   */
    getConstants(Obj) {
        return this.httpClient.post(this.urlObject.UrlObj.clientDropDownValues, Obj, this.options);
    }

    /**
   * @method documentDropDownValues()
   * @desc get drop doen constants for document
   */
    documentDropDownValues(Obj) {
        return this.httpClient.post(this.urlObject.UrlObj.documentDropDownValues, Obj, this.options);
    }

    /**
   * @method createClient()
   * @desc create client 
   */
    createClient(Obj) {
        return this.httpClient.post(this.urlObject.UrlObj.createClient, Obj, this.options);
    }

    /**
   * @method createIndividuals()
   * @desc create client 
   */
    getIndividuals(Obj) {
        return this.httpClient.post(this.urlObject.UrlObj.clients, Obj, this.options);
    }

    /**
   * @method createIndividuals()
   * @desc create client 
   */
    searchIndividuals(Obj) {
        return this.httpClient.post(this.urlObject.UrlObj.searchClientDetails, Obj, this.options);
    }

    /**
   * @method createIndividuals()
   * @desc create client 
   */
    getClientAllDetails(Obj) {
        return this.httpClient.post(this.urlObject.UrlObj.getClientAllDetails, Obj, this.options);
    }

}