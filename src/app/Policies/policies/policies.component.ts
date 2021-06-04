import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from "../../services/user";
import { IndividualDetailServiceService } from 'src/app/individual-detail-service.service';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['first_name','carrier_id','policy_number','product_description','effective_date', 'status', 'end_date'];
  dataSource: any;
  data: any = [];
  length: any = 0;
  constants: any = [];
  carrier:any=[];

  constructor(private savePolicies: IndividualDetailServiceService,private spinner: NgxSpinnerService,private api: ApiService, public Router: Router) {
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


  getCarrier(id){
    return this.carrier.filter(function (entry) { return entry.carrier_id === id })[0].carrier_name;
  }

  getDetail() {
    this.constants = JSON.parse(localStorage.getItem("policy_constants")).status;
    const obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getCarriers(obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.carrier = data.result;
      }
    });


    this.api.getAllPoliciesDetails(obj).subscribe((data: any) => {
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

        if (data.result['policyDetails'][0]['product_class'] == 'I' || data.result['policyDetails'][0]['product_class'] == '|' && data.result['policyDetails'][0]['primary_id']) {
          const Obj = {
            userId: localStorage.getItem('userId'),
            clientId: data.result['policyDetails'][0]['primary_id']
          }
          this.api.getClientRelationships(Obj).subscribe((data: any) => {
            if (data.responseCode === 200) {
              console.log(this.savePolicies.addToPolicy({ "policyMembers": data.result }));
            }
          });
        } else {
          const Obj = {
            userId: localStorage.getItem('userId'),
            group_id: data.result['policyDetails'][0]['primary_id']
          }
          this.api.getGroupAllDetails(Obj).subscribe((data: any) => {
            if (data.responseCode === 200) {
              console.log(this.savePolicies.addToPolicy({ "policyMembers": data.result.groupMembersDetails }));
            }
          });
        }

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
