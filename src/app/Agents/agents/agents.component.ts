import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from "../../services/user";

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['first_name', 'last_name','agent_license_number','national_producer_number'];
  dataSource: any;
  data: any = [];
  length: any = 0;

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
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getAgents(Obj).subscribe((data: any) => {
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
        this.length = data.result.length;
      }
    });
  }

  newAgent() {
    this.Router.navigate(['agents/newAgents', { edit: 0 }]);
  }

  getSingleAgent(agent_id) {

    this.spinner.show();
    const Obj = {
      userId: localStorage.getItem('userId'),
      agent_id: agent_id
    }
    this.api.getAgentAllDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        localStorage.setItem('AgentDetails', JSON.stringify(data.result));
        if (data.result[0].edit == 2) {
          var edit = 1
        } else {
          edit = 2
        }
        this.Router.navigate(['agents/newAgents', { edit: data.result[0].edit }]);
      }
    });
  }
}
