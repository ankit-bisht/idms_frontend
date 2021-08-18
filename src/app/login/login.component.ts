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
      let array = new Array();
      let object = new Object();
      if (data.responseCode === 200) {
        localStorage.setItem('token', data.result.authorizationToken);
        localStorage.setItem('userId', data.result.userDetails.user_id);
        localStorage.setItem('username', data.result.userDetails.username);
        localStorage.setItem('individualDetails', "");
        const Obj = {
          userId: data.result.userDetails.user_id
        }
        this.api.getPolicyConstants(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            localStorage.setItem("policy_constants",JSON.stringify(data.result));
          }
        });
        this.api.getCarriers(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            localStorage.setItem("carrier_data",JSON.stringify(data.result));
          }
        });
        this.api.getConstants(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            localStorage.setItem('constants', JSON.stringify(data.result));
            // this.clientType = data.result.clientType;
          }
        });
        this.api.getIndividuals(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            localStorage.setItem('clients', JSON.stringify(data['result']))
          }
        });
        this.api.documentDropDownValues(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            for (let index = 0; index < data.result.length; index++) {
              object[data.result[index].document_type_id]= data.result[index].doc_type_description;
            }
          }
          localStorage.setItem('docType', JSON.stringify(object));
        });
        this.Router.navigate(['/dashboard']);
      } else {
        this.FormError = data.error;
      }
    });
  }

}
