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
  selector: 'app-commission-reports',
  templateUrl: './commission-reports.component.html',
  styleUrls: ['./commission-reports.component.scss']
})
export class CommissionReportsComponent implements OnInit {

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
  clients: any;
  productList: any;
  openTab: boolean = true;
  isLoading: boolean;
  public primary = [];
  hideDocumentValue: boolean = false;
  hidePaymentValue: boolean = false;
  months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  };

  columns = [
    { name: 'Policy Number', props: 'policy_number', minWidth: 0 },
    { name: 'First Name', props: 'first_name', minWidth: 0 },
    { name: 'Last Name', props: 'last_name', minWidth: 0 },
    { name: 'Member Count', props: 'member_count', minWidth: 0 },
    { name: 'Member Name', props: 'member_name', minWidth: 0 },
    { name: 'Status', props: 'status', minWidth: 0 },
    { name: 'Carrier', props: 'carrier_name', minWidth: 250 },
    { name: 'Paid Comp', props: 'commission_paid', minWidth: 0 },
    { name: 'Expected Comp', props: 'commission_expected', minWidth: 0 },
    { name: 'Short Over', props: 'short_over', minWidth: 0 },
  ];

  allColumns = [
    { name: 'Policy Number', props: 'policy_number', minWidth: 0 },
    { name: 'First Name', props: 'first_name', minWidth: 0 },
    { name: 'Last Name', props: 'last_name', minWidth: 0 },
    { name: 'Member Count', props: 'member_count', minWidth: 0 },
    { name: 'Member Name', props: 'member_name', minWidth: 0 },
    { name: 'Status', props: 'status', minWidth: 0 },
    { name: 'Carrier', props: 'carrier_name', minWidth: 250 },
    { name: 'Paid Comp', props: 'commission_paid', minWidth: 0 },
    { name: 'Expected Comp', props: 'commission_expected', minWidth: 0 },
    { name: 'Short Over', props: 'short_over', minWidth: 0 },
  ];

  ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent, { static: true }) myFilterTable: DatatableComponent;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;

  constructor(private elementRef: ElementRef, private fb: FormBuilder, private spinner: NgxSpinnerService, private api: ApiService) { }

  ngOnInit() {
    for (let i = (this.currentYear - 15); i < (this.currentYear + 15); i++) {
      this.years.push(i);
    }
    this.constants = JSON.parse(localStorage.getItem("policy_constants"));
    this.clients = JSON.parse(localStorage.getItem('clients'));
    this.buildPolicyForm();
    this.setIndividial();
  }

  submitCarrier() {
    this.productList = [];
    this.getAllProductIds(this.policyForm.value.carrier);
  }

  getAllProductIds(id) {
    const obj = {
      carrierId: id,
      userId: localStorage.getItem('userId')
    }
    this.spinner.show();
    this.api.getAllProductIds(obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.productList = data.result;
        let getClientDetail = localStorage.getItem('PoliciesDetails') ? JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails : false;
      }
    });
  }

  setIndividial() {
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getCarriers(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.carriers = data.result;
      }
    });
  }

  buildPolicyForm(): void {

    this.policyForm = new FormGroup({
      "product_name": new FormControl('',),
      "carrier": new FormControl('',),
      "mem_count": new FormControl(''),
      "com_value": new FormControl(''),
      "first_name": new FormControl('',),
      "last_name": new FormControl('',),
      "start_month_from": new FormControl('',),
      "start_month_to": new FormControl('',),
      "start_year_from": new FormControl('',),
      "start_year_to": new FormControl('',),
      "date_from": new FormControl(''),
      "date_to": new FormControl(''),
      // "end_month_from": new FormControl('',),
      // "end_month_to": new FormControl('',),
      // "end_year_from": new FormControl('',),
      // "end_year_to": new FormControl('',),
      "election_tier": new FormControl('',),
      "policy_status": new FormControl('',),
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
    if (form.value.start_month_from && !form.value.start_month_to) {
      alert('Please select a valid Month Range!');
      return;
    };
    if (!form.value.start_month_from && form.value.start_month_to) {
      alert('Please select a valid Month Range!');
      return;
    };
    if (form.value.start_year_from && !form.value.start_year_to) {
      alert('Please select a valid Year Range!');
      return;
    };
    if (!form.value.start_year_from && form.value.start_year_to) {
      alert('Please select a valid Year Range!');
      return;
    };

    if (form.value.end_month_from && !form.value.end_month_to) {
      alert('Please select a valid Month Range!');
      return;
    };
    if (!form.value.end_month_from && form.value.end_month_to) {
      alert('Please select a valid Month Range!');
      return;
    };
    if (form.value.end_year_from && !form.value.end_year_to) {
      alert('Please select a valid Year Range!');
      return;
    };
    if (!form.value.end_year_from && form.value.end_year_to) {
      alert('Please select a valid Year Range!');
      return;
    };

    // if (form.value.date_from && !form.value.date_to) {
    //   alert('Please select a valid Date Range!');
    //   return;
    // };
    // if (!form.value.date_from && form.value.date_to) {
    //   alert('Please select a valid Date Range!');
    //   return;
    // };

    this.spinner.show();
    this.isLoading = true;
    this.openTab = false;
    form.value.date_from = form.value.date_from && moment(form.value.date_from).format('MM/DD/YYYY');
    form.value.date_to = form.value.date_to && moment(form.value.date_to).format('MM/DD/YYYY');
    this.api.getCommissionReports(form.value).subscribe((data: any) => {
      if (data.responseCode === 200) {
        data.result.map((ele, key) => {
          if (ele.commission_expected != null && ele.commission_paid != null) {
            data.result[key].short_over = ele.commission_expected - ele.commission_paid
          }
          if (ele.month) {
            data.result[key].month = this.months[ele.month];
          }
          if (ele.member_id != null) {
            let client = this.clients.filter(x => x.client_id == ele.member_id)
            data.result[key].member_name = client.length > 0 ? client[0].first_name + ' ' + client[0].last_name : ''
          }
        })
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
      return d.policy_number && d.policy_number.toString().toLowerCase().indexOf(val) !== -1 ||
        d.first_name && d.first_name.toString().toLowerCase().indexOf(val) !== -1 ||
        d.last_name && d.last_name.toString().toLowerCase().indexOf(val) !== -1 ||
        d.member_count && d.member_count.toString().toLowerCase().indexOf(val) !== -1 ||
        d.member_name && d.member_name.toString().toLowerCase().indexOf(val) !== -1 ||
        d.status && d.status.toString().toLowerCase().indexOf(val) !== -1 ||
        d.carrier_name && d.carrier_name.toString().toLowerCase().indexOf(val) !== -1 ||
        d.commission_paid && d.commission_paid.toString().toLowerCase().indexOf(val) !== -1 ||
        d.commission_expected && d.commission_expected.toString().toLowerCase().indexOf(val) !== -1 || !val;
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

