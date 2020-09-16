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

    // public getUsers(): Observable {
    //     let fakeUsers: User[] = [
    //         { position: 1, firstName: 'Dhiraj', lastName: 'Ray', email: 'dhiraj@gmail.com' },
    //         { position: 2, firstName: 'Tom', lastName: 'Jac', email: 'Tom@gmail.com' },
    //         { position: 3, firstName: 'Hary', lastName: 'Pan', email: 'hary@gmail.com' },
    //         { position: 4, firstName: 'praks', lastName: 'pb', email: 'praks@gmail.com' },
    //     ];
    //     return Observable.of(fakeUsers).delay(500);
    // }

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