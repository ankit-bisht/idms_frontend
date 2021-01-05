import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from "../../services/user";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['group_name', 'SIC', 'FEIN', 'email', 'phone'];
  dataSource: any;
  data: any = [];
  length: any = 0;

  constructor(private spinner: NgxSpinnerService, private api: ApiService, public Router: Router) {
  }

  ngOnInit() {
    this.getDetail();
    localStorage.removeItem('GroupDetails')
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
    this.api.getGroups(Obj).subscribe((data: any) => {
      this.spinner.show();
      if (data.responseCode === 200) {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        let users: User[] = [data.result.groupDetails];
        this.data = users[0];
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.length = data.result.length;
      }
    });
  }

  newGroup() {
    this.Router.navigate(['groups/newGroups', { edit: 0 }]);
  }

  getSingleIndividual(group_id) {

    this.spinner.show();
    const Obj = {
      userId: localStorage.getItem('userId'),
      group_id: group_id
    }
    this.api.getGroupAllDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        localStorage.setItem('GroupDetails', JSON.stringify(data.result));
        if (data.result.groupDetails[0].edit == 2) {
          var edit = 1
        } else {
          edit = 2
        }
        this.Router.navigate(['groups/newGroups', { edit: data.result.groupDetails[0].edit }]);
      }
    });
  }
}
