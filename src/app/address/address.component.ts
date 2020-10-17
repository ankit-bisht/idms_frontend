import { Component, OnChanges, SimpleChanges,Input, ViewChild, TemplateRef } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import * as cities from 'list-of-us-cities';
import { IndividualDetailServiceService } from '../individual-detail-service.service';
import { ApiService } from '../services/api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Constants } from '../configuration/constants';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnChanges {

  addressForm: FormGroup;
  control: FormArray;
  mode: boolean;
  addresstype: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  states: any;
  city: any;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(public States: Constants, private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) {
    this.states = States.stateValue;
  }

  @Input() disable: boolean;


  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.city = cities;
    this.touchedRows = [];
    this.addressForm = this.fb.group({
      clientAddressDetails: this.fb.array([])
    });

    if (localStorage.getItem('ClientDetails')) {
      if (JSON.parse(localStorage.getItem('ClientDetails')).clientAddressDetails.length >= 1) {
        this.setDetails();
      }
    }

    if (disable.disable.currentValue) {
      this.addressForm.disable();
    } else {
      this.addressForm.enable();
      // this.addRow();
    }
  }

  ngAfterOnInit() {
    this.control = this.addressForm.get('clientAddressDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      suite: [''],
      number: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      address_type: ['', Validators.required],
      from_date: [''],
      to_date: [''],
      isEditable: [true]
    });
  }

  setDetails() {
    const control = this.addressForm.get('clientAddressDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('ClientDetails')).clientAddressDetails;
    Details.map(element => {
      delete element.address_id;
      control.push(this.setForm(element));
    });
    this.addressForm.value.clientAddressDetails.map((element, key) => {
      const id = key + 1;
      element.address_id = id.toString();
      delete element.isEditable;
    });
    this.saveIndividuals.addToIndividual(this.addressForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      suite: [element.suite],
      number: [element.number, Validators.required],
      street: [element.street, Validators.required],
      city: [element.city, Validators.required],
      state: [element.state, Validators.required],
      zip: [element.zip, Validators.required],
      address_type: [element.address_type, Validators.required],
      from_date: [element.from_date],
      to_date: [element.to_date],
      isEditable: [false]
    });
  }

  getConstants() {
    this.addresstype = JSON.parse(localStorage.getItem('constants')).addressType;
  }

  private closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }

  addRow() {
    const control = this.addressForm.get('clientAddressDetails') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.addressForm.get('clientAddressDetails') as FormArray;
    control.removeAt(index);
    this.submitForm();
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  get getFormControls() {
    const control = this.addressForm.get('clientAddressDetails') as FormArray;
    return control;
  }

  format = (input) => {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, '$2/$3/$1');
  };

  submitForm() {
    this.closeAllModals();
    const control = this.addressForm.get('clientAddressDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    if (!this.addressForm.valid) {
      // setTimeout(() => {
      //   this.modalMessage = "Please Fill All Details Correctly!!"
      //   return this.modalRef = this.modalService.show(this.templateRef);
      // }, 5000);

    } else {
      var addressDetails = this.addressForm.value.clientAddressDetails;
      addressDetails.map((element, key) => {
        delete element.isEditable;
        const id = key + 1;
        element.address_id = id.toString();
        element.zip = element.zip.toString();
        if (element.from_date != '') {
          element.from_date = new Date(element.from_date).toISOString().split('T')[0];
          element.from_date = this.format(element.from_date);

        }
        if (element.to_date != "") {
          element.to_date = new Date(element.to_date).toISOString().split('T')[0];
          element.to_date = this.format(element.to_date);
        }
      });
      console.log(this.saveIndividuals.addToIndividual(this.addressForm.value));
    }
  }
}
