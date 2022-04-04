import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../services/api.service';
import { ViewEncapsulation } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import * as moment from 'moment';

@Component({
  selector: 'app-policy-reports',
  templateUrl: './policy-reports.component.html',
  styleUrls: ['./policy-reports.component.scss']
})
export class PolicyReportsComponent implements OnInit {

  policyForm: FormGroup;
  temp = [];
  rows = [];
  clientType: any;
  currentYear: number = new Date().getFullYear();
  years: number[] = [];
  expiry_years: number[] = [];
  constants: any;
  products: any;
  carriers: any;
  openTab: boolean = true;
  isLoading: boolean;
  public primary = [];
  hideDocumentValue: boolean = false;
  hidePaymentValue: boolean = false;

  columns = [
    { name: 'Primary', props: 'first_name', minWidth: 0 },
    { name: 'Carrier', props: 'carrier_name', minWidth: 250 },
    { name: 'Policy Number', props: 'policy_number', minWidth: 0 },
    { name: 'Product Name', props: 'product_description', minWidth: 250 },
    { name: 'Effective Date', props: 'effective_date', minWidth: 0 },
    { name: 'End Date', props: 'end_date', minWidth: 0 },
    { name: 'Status', props: 'status', minWidth: 0 },
  ];

  allColumns = [
    { name: 'Primary', props: 'first_name', minWidth: 0 },
    { name: 'Carrier', props: 'carrier_name', minWidth: 250 },
    { name: 'Policy Number', props: 'policy_number', minWidth: 0 },
    { name: 'Product Name', props: 'product_description', minWidth: 250 },
    { name: 'Effective Date', props: 'effective_date', minWidth: 0 },
    { name: 'End Date', props: 'end_date', minWidth: 0 },
    { name: 'Status', props: 'status', minWidth: 0 },
  ];

  ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent, { static: true }) myFilterTable: DatatableComponent;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;

  constructor(private elementRef: ElementRef, private fb: FormBuilder, private spinner: NgxSpinnerService, private api: ApiService) { }

  ngOnInit() {
    this.constants = JSON.parse(localStorage.getItem("policy_constants"));
    this.buildPolicyForm();
    this.setIndividial();
  }

  setIndividial() {
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.spinner.show();
    this.api.getIndividuals(Obj).subscribe((data: any) => {
      this.spinner.hide();
      if (data.responseCode === 200) {
        this.primary = data.result;
      }
    });
    this.api.getAllProductsDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.products = data.result;
      }
    });
    this.api.getCarriers(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.carriers = data.result;
      }
    });
  }

  buildPolicyForm(): void {

    this.policyForm = new FormGroup({
      "policy_type": new FormControl('',),
      "primary": new FormControl('',),
      "carrier": new FormControl('',),
      "policy_number": new FormControl('',),
      "product_name": new FormControl('',),
      "effective_date": new FormControl('',),
      "end_date": new FormControl('',),
      "status": new FormControl('',)
    });
  }

  adjustColumnMinWidth() {
    const element = this.elementRef.nativeElement as HTMLElement;
    const rows = element.getElementsByTagName("datatable-body-row");
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("datatable-body-cell");
      for (let k = 0; k < cells.length; k++) {
        const cell = cells[k];
        const cellSizer = cell.children[0].children[0] as HTMLElement;
        const sizerWidth = cellSizer.getBoundingClientRect().width;
        if (this.columns[k].minWidth < sizerWidth) {
          this.columns[k].minWidth = sizerWidth;
        }
      }
    }
  }

  resetReportForm() {
    this.policyForm.reset();
  }

  toggle(col) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columns = this.columns.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.columns = [...this.columns, col];
    }
  }

  isChecked(col) {
    return (
      this.columns.find(c => {
        return c.name === col.name;
      }) !== undefined
    );
  }

  onSubmit(form: FormGroup) {

    console.log(form.value);

    this.spinner.show();
    this.isLoading = true;
    this.openTab = false;
    form.value.effective_date = form.value.effective_date && moment(form.value.effective_date).format('MM/DD/YYYY');
    form.value.end_date = form.value.end_date && moment(form.value.end_date).format('MM/DD/YYYY');
    this.api.searchPolicyDetails(form.value).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.temp = [...data.result];
        this.rows = data.result;
        this.spinner.hide();
        this.isLoading = false;
      } else {
        this.spinner.hide();
      }
    });
  }


  updateFilter(event) {
    const val = event.target.value.toString().toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.first_name && d.first_name.toString().toLowerCase().indexOf(val) !== -1 ||
        d.carrier_name && d.carrier_name.toString().toLowerCase().indexOf(val) !== -1 ||
        d.policy_number && d.policy_number.toString().toLowerCase().indexOf(val) !== -1 ||
        d.product_description && d.product_description.toString().toLowerCase().indexOf(val) !== -1 ||
        d.effective_date && d.effective_date.toString().toLowerCase().indexOf(val) !== -1 ||
        d.end_date && d.end_date.toString().toLowerCase().indexOf(val) !== -1 ||
        d.cistatusty && d.status.toString().toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.myFilterTable.offset = 0;
  }

  ExportToExcle() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Individual Report',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(this.rows);
  }

}
