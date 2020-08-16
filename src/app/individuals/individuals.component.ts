import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-individuals',
  templateUrl: './individuals.component.html',
  styleUrls: ['./individuals.component.scss']
})
export class IndividualsComponent implements OnInit {

  searchForm: FormGroup;
  config: any;
  collection: any = [];

  items = [];
  pageOfItems: Array<any>;

  constructor(private spinner: NgxSpinnerService, private api: ApiService, public Router: Router) {
    this.searchForm = new FormGroup({
      'search': new FormControl('', [
        Validators.required
      ]),
      'type':new FormControl('', [
        Validators.required
      ]),
    });

  }

  ngOnInit() {
    this.getIndividuals();
  }

  getIndividuals() {
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getIndividuals(Obj).subscribe((data: any) => {
      this.spinner.show();
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.items = data.result;
        this.items.map((item, i) => {
          item.id = i + 1;
        });
      }
    });
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  search() {
    const Obj={
      userId: localStorage.getItem('userId'),
      searchParameter:this.searchForm.value.type,
      parameterValue:this.searchForm.value.search
    }
    this.api.searchIndividuals(Obj).subscribe((data: any) => {
      this.spinner.show();
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.items = data.result;
        this.items.map((item, i) => {
          item.id = i + 1;
        });
      }
    });
    // /** spinner starts on init */
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
  }

  newIndividual() {
    this.Router.navigate(['/newIndividual']);
  }

}
