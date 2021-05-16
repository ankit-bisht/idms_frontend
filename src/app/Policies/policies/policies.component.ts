import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from "../../services/user";

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['policy_number', 'status', 'effective_date', 'end_date'];
  dataSource: any;
  data: any = [];
  length: any = 0;
  constants:any = [];

  constructor(private spinner: NgxSpinnerService, private api: ApiService, public Router: Router) {
  }

  ngOnInit() {
    this.getDetail();
    localStorage.removeItem('AgentDetails')
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getDetail() {
    this.constants = JSON.parse(localStorage.getItem("policy_constants")).status;
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getAllPoliciesDetails(Obj).subscribe((data: any) => {
      this.spinner.show();
      if (data.responseCode === 200) {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        let users: User[] = [data.result];
        this.data = users[0];
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.length = data.result.length;
      }
    });
  }

  newPolicies() {
    this.Router.navigate(['policies/newPolicies', { edit: 0 }]);
  }

  getSinglePolicy(policy_id) {

    this.spinner.show();
    const Obj = {
      userId: localStorage.getItem('userId'),
      policy_id: policy_id
    }
    this.api.getPolicyDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        localStorage.setItem('PoliciesDetails', JSON.stringify(data.result));
        if (data.result.policyDetails[0].edit == 2) {
          var edit = 1
        } else {
          edit = 2
        }
        this.Router.navigate(['policies/newPolicies', { edit: data.result.policyDetails[0].edit }]);
      }
    });
  }
}
