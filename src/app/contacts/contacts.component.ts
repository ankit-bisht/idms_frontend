import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { IndividualDetailServiceService } from '../individual-detail-service.service';
import { ApiService } from '../services/api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"],
})
export class ContactsComponent implements OnInit {

  contactForm: FormGroup;
  control: FormArray;
  mode: boolean;
  contactype: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) { }

  ngOnInit(): void {
    this.getConstants();
    this.touchedRows = [];
    this.contactForm = this.fb.group({
      clientContactDetails: this.fb.array([])
    });

    if (localStorage.getItem('ClientDetails')) {
      if (JSON.parse(localStorage.getItem('ClientDetails')).clientContactDetails.length >= 1) {
        this.setDetails();
      }else{
        this.addRow();
      }
    } else {
      this.addRow();
    }
  }

  ngAfterOnInit() {
    this.control = this.contactForm.get('clientContactDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      email: ['', Validators.email],
      contact_type: ['', Validators.required],
      phone: [''],
      isEditable: [true]
    });
  }

  getConstants() {
    this.contactype = JSON.parse(localStorage.getItem('constants')).contactType;
  }

  addRow() {
    const control = this.contactForm.get('clientContactDetails') as FormArray;
    control.push(this.initiateForm());
  }

  setDetails() {
    const control = this.contactForm.get('clientContactDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('ClientDetails')).clientContactDetails;

    Details.map(element => {
      control.push(this.setForm(element));
    });
    // this.deleteRow(0);    
    this.saveIndividuals.addToIndividual(this.contactForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      email: [element.email, Validators.email],
      contact_type: [element.contact_type, Validators.required],
      phone: [element.phone],
      isEditable: [true]
    });
  }

  deleteRow(index: number) {
    const control = this.contactForm.get('clientContactDetails') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  get getFormControls() {
    const control = this.contactForm.get('clientContactDetails') as FormArray;
    return control;
  }

  submitForm() {
    const control = this.contactForm.get('clientContactDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    if (!this.contactForm.valid) {
      // setTimeout(() => {
      //   this.modalMessage = "Please Fill All Details Correctly!!"
      //   return this.modalRef = this.modalService.show(this.templateRef);
      // }, 5000);

    } else {
      var contactsDetails = this.contactForm.value.clientContactDetails;
      contactsDetails.map((element, key) => {
        delete element.isEditable;
        const id = key + 1;
        element.phone = element.phone.toString();
        element.contact_id = id.toString();
      });
      console.log(this.saveIndividuals.addToIndividual(this.contactForm.value));
    }
  }
}
