import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../configuration/config';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { User } from "./user";
@Injectable()
export class ApiService {

    options: any;

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


    /**
   * @method deleteClient()
   * @desc delete client
   */
    deleteClient(obj) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
        return this.httpClient.post(this.urlObject.UrlObj.deleteClient, obj, this.options);
    }

    /**
   * @method getConstants()
   * @desc get constants
   */
    getConstants(Obj) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
        return this.httpClient.post(this.urlObject.UrlObj.clientDropDownValues, Obj, this.options);
    }

    /**
   * @method documentDropDownValues()
   * @desc get drop doen constants for document
   */
    documentDropDownValues(Obj) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
        return this.httpClient.post(this.urlObject.UrlObj.documentDropDownValues, Obj, this.options);
    }

    /**
   * @method createClient()
   * @desc create client 
   */
    createClient(Obj) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
        return this.httpClient.post(this.urlObject.UrlObj.createClient, Obj, this.options);
    }

    /**
   * @method createClient()
   * @desc create client 
   */
    updateClient(Obj) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
        return this.httpClient.post(this.urlObject.UrlObj.updateClient, Obj, this.options);
    }

    /**
   * @method uploadAttachment()
   * @desc create client 
   */
    uploadAttachment(Obj) {

        const headers = new HttpHeaders({
            // 'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }

        return this.httpClient.post(this.urlObject.UrlObj.upload, Obj, this.options);
    }

    /**
   * @method createIndividuals()
   * @desc create client 
   */
    getIndividuals(Obj) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
        return this.httpClient.post(this.urlObject.UrlObj.clients, Obj, this.options);
    }

    /**
   * @method createIndividuals()
   * @desc create client 
   */
    searchIndividuals(Obj) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
        return this.httpClient.post(this.urlObject.UrlObj.searchClientDetails, Obj, this.options);
    }

    /**
   * @method createIndividuals()
   * @desc create client 
   */
    getClientAllDetails(Obj) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });
        this.options = {
            headers: headers
        }
        return this.httpClient.post(this.urlObject.UrlObj.getClientAllDetails, Obj, this.options);
    }

}