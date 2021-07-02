import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges } from "@angular/core";
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
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-commision',
  templateUrl: './commision.component.html',
  styleUrls: ['./commision.component.scss']
})
export class CommisionComponent implements OnInit {

  commissionForm: FormGroup;
  control: FormArray;
  mode: boolean;
  contactype: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  filteredClients: any;
  filterArr = [];
  display = "none";
  disableButton = true;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  displayedColumns = ['address_type', 'number', 'street', 'city', 'state', 'zip'];
  dataSource: any;
  length: any = 0;

  constructor(private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveGroup: IndividualDetailServiceService) { }

  @Input() disable: boolean;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.commissionForm = this.fb.group({
      policyCommissionDetails: this.fb.array([])
    });
    if (localStorage.getItem('CarrierDetails')) {
      if (JSON.parse(localStorage.getItem('CarrierDetails')).policyCommissionDetails.length >= 1) {
        this.setDetails();
      }
    }

    if (disable.disable.currentValue) {
      this.commissionForm.disable();
    } else {
      this.commissionForm.enable();
    }
    // this.dataSource = new MatTableDataSource(this.filteredClients);
    // this.length = this.filteredClients.length;
  }

  ngOnInit() {
    // this.control = this.commissionForm.get('policyCommissionDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    let value = JSON.parse(localStorage.getItem('commissionValue'));
    let individuals = this.saveGroup.getPolicy();
    let members = [];
    if (individuals['policyMembersDetails']) {
      individuals['policyMembersDetails'][0]['member_id'].push(individuals['primary_id']);
      members = individuals['policyMembersDetails'][0]['member_id'].filter(function (item, i, ar) { return ar.indexOf(item) === i; });
    } else {
      members.push(individuals['primary_id']);
    }

    if(individuals['policyDependentDetails']){
      individuals['policyDependentDetails'].forEach(element => {
          members.concat(element['dependent']);
      });
    }
    console.log(members);


    let total_commission = members.length * value;

    //form
    return this.fb.group({
      'commission_value': new FormControl({ value: value, disabled: true }, Validators.required),
      "indivduals": new FormControl({ value: members.length, disabled: true }, [Validators.required]),
      "total_commission": new FormControl({ value: total_commission, disabled: false }, [Validators.required]),
      isEditable: [true]
    });
  }

  getConstants() {
    this.contactype = JSON.parse(localStorage.getItem('constants')).contactType;
  }

  addRow() {
    const control = this.commissionForm.get('policyCommissionDetails') as FormArray;
    control.push(this.initiateForm());
    this.disableButton = false;
  }

  setDetails() {
    const control = this.commissionForm.get('policyCommissionDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('CarrierDetails')).policyCommissionDetails;

    Details.map(element => {
      control.push(this.setForm(element));
    });
    this.commissionForm.value.policyCommissionDetails.map((element, key) => {
      const id = key + 1;
      element.contact_id = id.toString();
      delete element.isEditable;
    });
    this.saveGroup.addToPolicy(this.commissionForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      'commission_value': [element.value],
      "indivduals": [element.individuals],
      "total_commission": [element.total],
      isEditable: [false]
    });
  }

  deleteRow(index: number) {
    const control = this.commissionForm.get('policyCommissionDetails') as FormArray;
    control.removeAt(index);
    this.disableButton = true;
    this.submitForm();
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  setValue(group: FormGroup, address_id) {
    group.get('address_id').setValue(address_id);
    console.log(this.saveGroup.addToPolicy(this.commissionForm.value));
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
    console.log(this.saveGroup.addToPolicy(this.commissionForm.value));
  }

  get getFormControls() {
    const control = this.commissionForm.get('policyCommissionDetails') as FormArray;
    return control;
  }

  openModal() {
    this.display = "block";
    this.dataSource = new MatTableDataSource(this.filteredClients);
    this.length = this.filteredClients.length;
  }

  onCloseHandled() {
    this.display = "none";
  }

  submitForm() {
    const control = this.commissionForm.get('policyCommissionDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    var contactsDetails = this.commissionForm.value.policyCommissionDetails;
    contactsDetails.map((element, key) => {
      delete element.isEditable;
      const id = key + 1;
    });
    console.log(this.saveGroup.addToPolicy(this.commissionForm.value));
  }
}
