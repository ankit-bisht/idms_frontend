import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Configuration } from '../configuration/config';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  FormError: string;
  loginForm: FormGroup;
  errorMessage: string;
  placeholder: string;
  hashedPassword: any;


  constructor(private api: ApiService, public Router: Router, private secert: Configuration, private commonFunction: CommonService) { }

  ngOnInit() {
    this.buildLoginForm();
  }


  buildLoginForm(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        Validators.pattern(/\S+@\S+\.\S+/),
      ]),
      'password': new FormControl('', [
        Validators.required,
      ]),
    })
  }

  login() {
    this.hashedPassword = this.commonFunction.HmacSHA256(this.loginForm.value.password);

    const loginObj = {
      'email': this.loginForm.value.email,
      'password': this.hashedPassword,
    };
    this.api.loginApi(loginObj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        localStorage.setItem('token', data.result.authorizationToken);
        localStorage.setItem('userId', data.result.userDetails.user_id);
        localStorage.setItem('username', data.result.userDetails.username);
        localStorage.setItem('individualDetails',"");
        this.Router.navigate(['/dashboard']);
      } else {
        this.FormError = data.error;
      }
    });
  }

}
