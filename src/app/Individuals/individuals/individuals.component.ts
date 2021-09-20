import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from "../../services/user";
import { IndividualDetailServiceService } from '../../individual-detail-service.service';


@Component({
  selector: 'app-individuals',
  templateUrl: './individuals.component.html',
  styleUrls: ['./individuals.component.scss']
})
export class IndividualsComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['first_name', 'middle_name', 'last_name', 'DOB', 'phone', 'email',];
  dataSource: any;
  data: any = [];
  length: any = 0;

  constructor(private spinner: NgxSpinnerService,private saveIndividuals: IndividualDetailServiceService, private api: ApiService, public Router: Router) {
  }

  ngOnInit() {
    this.getDetail();
    localStorage.removeItem('ClientDetails')
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getDetail() {
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getIndividuals(Obj).subscribe((data: any) => {
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

  newIndividual() {
    this.Router.navigate(['individuals/newIndividual', {edit: 0}]);
  }

  getSingleIndividual(clientId) {
    this.spinner.show();
    const Obj = {
      userId: localStorage.getItem('userId'),
      clientId: clientId
    }
    this.api.getClientAllDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        localStorage.setItem('ClientDetails', JSON.stringify(data.result));
        console.log(this.saveIndividuals.addToIndividual(data.result));
        if (data.result.clientDetails[0].edit == 2) {
          var edit = 1
        } else {
          edit = 2
        }
        this.Router.navigate(['individuals/newIndividual', {edit: data.result.clientDetails[0].edit}]);
      }
    });
  }
}
