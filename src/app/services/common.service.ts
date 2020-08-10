import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Configuration } from '../configuration/config';

@Injectable()
export class CommonService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object,
        public httpClient: HttpClient,
        private secert: Configuration
    ) { }

    /**
    * @method isUserLoggedIn()
    * @desc check if user is logged in i.e token is present in Local Storage or not
    */

    isUserLoggedIn() {

        if (this.getItem('token') == null) {
            return false;
        } else {
            return true;
        }
    }

    /**
    * @method getItem()
    * @desc get item from Local Storage
    */

    getItem(key) {

        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(key);
        } else {
            return null;
        }
    }

    /**
    * @method HmacSHA256()
    * @desc get item from Local Storage
    */

    HmacSHA256(data) {
        return CryptoJS.HmacSHA256(data, this.secert.Hmac256Secret).toString(CryptoJS.enc.Hex);

    }

}