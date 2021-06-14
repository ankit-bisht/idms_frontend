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
  selector: 'app-new-carrier-contacts',
  templateUrl: './new-carrier-contacts.component.html',
  styleUrls: ['./new-carrier-contacts.component.scss']
})
export class NewCarrierContactsComponent implements OnChanges {

  contactForm: FormGroup;
  control: FormArray;
  mode: boolean;
  contactype: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  address = [];
  filteredClients: any;
  filterArr = [];
  display = "none";
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
    this.contactForm = this.fb.group({
      carrierContactDetails: this.fb.array([])
    });
    if (localStorage.getItem('CarrierDetails')) {
      if (JSON.parse(localStorage.getItem('CarrierDetails')).carrierContactDetails.length >= 1) {
        this.setDetails();
      }
    }

    if (disable.disable.currentValue) {
      this.contactForm.disable();
    } else {
      this.contactForm.enable();
    }
    // this.dataSource = new MatTableDataSource(this.filteredClients);
    // this.length = this.filteredClients.length;

    if (localStorage.getItem('CarrierDetails')) {
      const Details = this.saveGroup.getCarrier()['carrierAddressDetails'];
      if (Details) {
        this.filterIndividualsArray(Details.map(d => d.address_id));
      } else {
        this.filterIndividualsArray(0);
      }
    } else {
      this.filterIndividualsArray(0);
    }
  }

  ngAfterOnInit() {
    // this.control = this.contactForm.get('carrierContactDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      name: [''],
      position: [''],
      department: [''],
      fax: [''],
      notes: [''],
      valid: ['1'],
      address_id: [''],
      email: ['', Validators.email],
      // contact_type: [''],
      phone: [''],
      isEditable: [true]
    });
  }

  getConstants() {
    this.contactype = JSON.parse(localStorage.getItem('constants')).contactType;
  }

  addRow() {
    const control = this.contactForm.get('carrierContactDetails') as FormArray;
    control.push(this.initiateForm());
    this.address = this.saveGroup.getCarrier()['carrierAddressDetails'];
    this.filterIndividualsArray(0);
  }

  setDetails() {
    const control = this.contactForm.get('carrierContactDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('CarrierDetails')).carrierContactDetails;
    this.address = this.saveGroup.getCarrier()['carrierAddressDetails'] ? this.saveGroup.getCarrier()['carrierAddressDetails'] : [];

    Details.map(element => {
      control.push(this.setForm(element));
    });
    this.contactForm.value.carrierContactDetails.map((element, key) => {
      const id = key + 1;
      element.contact_id = id.toString();
      delete element.isEditable;
    });
    this.saveGroup.addToCarrier(this.contactForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      name: [element.name],
      position: [element.position],
      department: [element.department],
      fax: [element.fax],
      notes: [element.notes],
      valid: [element.valid],
      address_id: [element.address_id],
      email: [element.email, Validators.email],
      phone: [element.phone],
      isEditable: [false]
    });
  }

  disableField(index) {
    const Form = this.contactForm.controls.carrierContactDetails['controls'][index].controls;
    if (Form.contact_type.value == '1' || Form.contact_type.value == '2') {
      Form.phone.disable();
      Form.email.enable();
    } else {
      Form.email.disable();
      Form.phone.enable();
    }
  }

  getIndividual(val) {
    if (this.address) {
      let address = this.address.find(r => r.address_id == val);
      return !!address ? `${address.city} ${address.state}` : '';
    }
  }

  deleteRow(index: number) {
    const control = this.contactForm.get('carrierContactDetails') as FormArray;
    control.removeAt(index);
    this.submitForm();
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
    this.address = this.saveGroup.getCarrier()['carrierAddressDetails'];
    this.filterIndividualsArray(0);
  }

  setValue(group: FormGroup, address_id) {
    group.get('address_id').setValue(address_id);
    console.log(this.saveGroup.addToCarrier(this.contactForm.value));
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
    this.filterIndividualsArray(group.get('address_id').value);
  }

  get getFormControls() {
    const control = this.contactForm.get('carrierContactDetails') as FormArray;
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
    const control = this.contactForm.get('carrierContactDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    var contactsDetails = this.contactForm.value.carrierContactDetails;
    contactsDetails.map((element, key) => {
      delete element.isEditable;
      const id = key + 1;
      element.address_id = element.address_id ? element.address_id.toString() : '';
      element.phone = element.phone ? element.phone.toString() : '';
      element.contact_id = id.toString();
    });
    console.log(this.saveGroup.addToCarrier(this.contactForm.value));
  }


  filterIndividualsArray(id) {
    if (Array.isArray(id)) {
      this.filterArr.concat(id);
    } else {
      this.filterArr.push(id);
    }

    this.filteredClients = this.address ? this.address.filter(c => this.filterArr.indexOf(c.address_id) == -1) : [];
    this.filterArr = [...new Set(this.filterArr)];
  }
}
