import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  username: string;
  dashboardForm: FormGroup;
  notes: string;

  constructor(private _snackBar: MatSnackBar, private api: ApiService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') ? localStorage.getItem('username') : 'user';
    this.buildIndividualForm();
  }


  buildIndividualForm(): void {

    this.dashboardForm = new FormGroup({
      "notes": new FormControl(''),
    });

    let getClientDetail = JSON.parse(localStorage.getItem('ClientDetails'));


    if (getClientDetail) {
      const Client = getClientDetail.clientDetails[0];

      this.dashboardForm.disable();
      this.notes = Client.notes ? Client.notes : '';
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{
      duration: 2000,
      panelClass: ['mat-toolbar', 'mat-primary']
  });
  }

  onSubmit(form: FormGroup){
    this.spinner.show();
    let obj = {
      userId: localStorage.getItem('userId'),
      notes:form.value.notes
    }
    this.api.userNotesUpdate(obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.openSnackBar(data.message,"");
      }
    });
  }

}
