import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges, AfterViewInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { IndividualDetailServiceService } from '../../individual-detail-service.service';
import { ApiService } from '../../services/api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-carrier-agents',
  templateUrl: './new-carrier-agents.component.html',
  styleUrls: ['./new-carrier-agents.component.scss']
})
export class NewCarrierAgentsComponent implements OnChanges {

  memberForm: FormGroup;
  control: FormArray;
  mode: boolean;
  relationshipType: any;
  clients: any;
  filteredClients: any;
  filterArr = [];
  clientDetails: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  document_status: any;
  display = "none";
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  displayedColumns = ['product_class', 'product_description'];
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;
  dataSource: any;
  idVal = "";
  length: any = 0;

  constructor(private spinner: NgxSpinnerService, public Router: Router, private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveGroup: IndividualDetailServiceService) { }

  @Input() disable: boolean;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.memberForm = this.fb.group({
      carrierAgentDetails: this.fb.array([])
    });
    if (localStorage.getItem('CarrierDetails')) {
      if (JSON.parse(localStorage.getItem('CarrierDetails')).carrierAgentDetails.length >= 1) {
        this.setDetails();
      }
    }
    if (disable.disable.currentValue) {
      this.memberForm.disable();
    } else {
      this.memberForm.enable();
      // this.addRow();
    }
    this.dataSource = new MatTableDataSource(this.filteredClients);
    // this.dataSource.paginator = this.paginator;
    this.length = this.filteredClients.length;

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterOnInit() {
    this.control = this.memberForm.get('carrierAgentDetails') as FormArray;
  }

  setDetails() {
    const control = this.memberForm.get('carrierAgentDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('CarrierDetails')).carrierAgentDetails;
    Details.map(element => {
      control.push(this.setForm(element));
    });
    this.memberForm.value.carrierAgentDetails.map((element, key) => {
      delete element.isEditable;
    });
    this.saveGroup.addToCarrier(this.memberForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      product_id: [element.product_id, Validators.required],
      isEditable: [false]
    });
  }


  getConstants() {
    this.clients = JSON.parse(localStorage.getItem('products'));
    if (localStorage.getItem('CarrierDetails')) {
      this.clientDetails = JSON.parse(localStorage.getItem('CarrierDetails')).carrierAgentDetails[0];
      if (this.clientDetails) {
        const Details = JSON.parse(localStorage.getItem('CarrierDetails')).carrierAgentDetails;
        this.filterIndividualsArray(Details.map(d => d.product_id));
        this.filterIndividualsArray(this.clientDetails.product_id);
      }
      this.filterIndividualsArray(0);
    } else {
      this.filterIndividualsArray(0);
    }
  }


  initiateForm(): FormGroup {
    return this.fb.group({
      product_id: [''],
      isEditable: [true]
    });
  }

  openModal() {
    this.display = "block";
  }

  onCloseHandled() {
    this.display = "none";
  }

  addRow() {
    const control = this.memberForm.get('carrierAgentDetails') as FormArray;
    control.push(this.initiateForm());
    this.submitForm();
  }

  deleteRow(index: number) {
    const control = this.memberForm.get('carrierAgentDetails') as FormArray;
    control.removeAt(index);
    this.submitForm();
  }

  setValue(group: FormGroup, product_id) {
    group.get('product_id').setValue(product_id);
    this.submitForm();
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
    this.submitForm();
    this.filterIndividualsArray(group.get('product_id').value);
  }

  get getFormControls() {
    const control = this.memberForm.get('carrierAgentDetails') as FormArray;
    return control;
  }


  closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }

  submitForm() {
    this.closeAllModals();
    const control = this.memberForm.get('carrierAgentDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    var documentDetails = this.memberForm.value.carrierAgentDetails;
    documentDetails.map((element, key) => {
      delete element.isEditable;
    });
    console.log(this.saveGroup.addToCarrier(this.memberForm.value));
  }

  getIndividual(val) {
    let client = this.clients.find(r => r.product_id == val);
    return !!client ? `${client.product_class} ${client.product_description}` : '';
  }

  filterIndividualsArray(id) {
    if (Array.isArray(id)) {
      this.filterArr.concat(id);
    } else {
      this.filterArr.push(id);
    }
    this.filteredClients = this.clients.filter(c => this.filterArr.indexOf(c.product_id) == -1);
    this.filterArr = [...new Set(this.filterArr)];
    this.dataSource = new MatTableDataSource(this.filteredClients);
    // this.dataSource.paginator = this.paginator;
    this.length = this.filteredClients.length;
  }
}
