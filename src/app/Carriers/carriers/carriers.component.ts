import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from "../../services/user";

@Component({
  selector: 'app-carriers',
  templateUrl: './carriers.component.html',
  styleUrls: ['./carriers.component.scss']
})
export class CarriersComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['carrier_name', 'website','phone'];
  dataSource: any;
  data: any = [];
  length: any = 0;

  constructor(private spinner: NgxSpinnerService, private api: ApiService, public Router: Router) {
  }

  ngOnInit() {
    this.getDetail();
    localStorage.removeItem('CarrierDetails')
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
    this.api.getCarriers(Obj).subscribe((data: any) => {
      this.spinner.show();
      if (data.responseCode === 200) {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        let users: User[] = [data.result];
        this.data = users[0];
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }
          return data[sortHeaderId];
        };
        this.length = data.result.length;
      }
    });
  }

  newCarrier() {
    this.Router.navigate(['carriers/newCarriers', { edit: 0 }]);
  }

  getSingleIndividual(carrier_id) {

    this.spinner.show();
    const Obj = {
      userId: localStorage.getItem('userId'),
      carrier_id: carrier_id
    }
    this.api.getCarrierAllDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        localStorage.setItem('CarrierDetails', JSON.stringify(data.result));
        if (data.result.carrierBaseDetails[0].edit == 2) {
          var edit = 1
        } else {
          edit = 2
        }
        this.Router.navigate(['carriers/newCarriers', { edit: data.result.carrierBaseDetails[0].edit }]);
      }
    });
  }
}
