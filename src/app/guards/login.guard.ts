import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private authService: CommonService, private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object) {

    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (isPlatformBrowser(this.platformId)) {            
            if (this.authService.isUserLoggedIn() === false) {
                this.router.navigate(['/login']);
                return false;
            } else {
                return true;
            }
        }
    }
}

