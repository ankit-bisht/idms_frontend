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
    this.addRow();
  }

  ngAfterOnInit() {
    this.control = this.contactForm.get('clientContactDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      email: ['', Validators.email],
      contact_type: ['', Validators.required],
      mobNumber: [''],
      isEditable: [true]
    });
  }

  getConstants() {
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getConstants(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        localStorage.setItem('constants', JSON.stringify(data.result));
        this.contactype = data.result.contactType;
      }
    });
  }

  addRow() {
    const control = this.contactForm.get('clientContactDetails') as FormArray;
    control.push(this.initiateForm());
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
      setTimeout(() => {
        this.modalMessage = "Please Fill All Details Correctly!!"
        return this.modalRef = this.modalService.show(this.templateRef);
      }, 5000);

    } else {
      var contactsDetails = this.contactForm.value.clientContactDetails;
      contactsDetails.map((element, key) => {
        delete element.isEditable;
        const id = key + 1;
        element.mobNumber = element.mobNumber.toString();
        element.contact_id = id.toString();
      });
      console.log(this.saveIndividuals.addToIndividual(this.contactForm.value));
    }
  }
}
