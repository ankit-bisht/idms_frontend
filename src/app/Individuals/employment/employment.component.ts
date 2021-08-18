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
import * as moment from 'moment';

@Component({
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.scss']
})
export class EmploymentComponent implements OnChanges {

  employmentForm: FormGroup;
  control: FormArray;
  mode: boolean;
  incomeFrequency: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) {
  }

  @Input() disable: boolean;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.employmentForm = this.fb.group({
      clientEmploymentDetails: this.fb.array([])
    });
    if (localStorage.getItem('ClientDetails')) {
      if (JSON.parse(localStorage.getItem('ClientDetails')).clientEmploymentDetails.length >= 1) {
        this.setDetails();
      }
    }
    if (disable.disable.currentValue) {
      this.employmentForm.disable();
    } else {
      this.employmentForm.enable();
      // this.addRow();
    }
  }

  ngAfterOnInit() {
    this.control = this.employmentForm.get('clientEmploymentDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      employer_name: [''],
      employer_phone: [''],
      income_amount: [''],
      income_frequency: [''],
      start_date: [''],
      end_date: [''],
      isEditable: [true]
    });
  }

  setDetails() {
    const control = this.employmentForm.get('clientEmploymentDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('ClientDetails')).clientEmploymentDetails;
    Details.map(element => {
      delete element.employment_id;
      control.push(this.setForm(element));
    });
    this.employmentForm.value.clientEmploymentDetails.map((element, key) => {
      const id = key + 1;
      element.employment_id = id.toString();
      delete element.isEditable;
    });
    this.saveIndividuals.addToIndividual(this.employmentForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      employer_name: [element.employer_name, Validators.required],
      employer_phone: [element.employer_phone],
      income_amount: [element.income_amount, Validators.required],
      income_frequency: [element.income_frequency, Validators.required],
      start_date: [element.start_date, Validators.required],
      end_date: [element.end_date],
      isEditable: [false]
    });
  }


  getConstants() {
    this.incomeFrequency = JSON.parse(localStorage.getItem('constants')).incomeFrequency;
  }
  format = (input) => {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, '$2/$3/$1');
  };

  private closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }

  addRow() {
    const control = this.employmentForm.get('clientEmploymentDetails') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.employmentForm.get('clientEmploymentDetails') as FormArray;
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
    const control = this.employmentForm.get('clientEmploymentDetails') as FormArray;
    return control;
  }

  submitForm() {
    this.closeAllModals();
    const control = this.employmentForm.get('clientEmploymentDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    if (!this.employmentForm.valid) {
      // setTimeout(() => {
      //   this.modalMessage = "Please Fill All Details Correctly!!"
      //   return this.modalRef = this.modalService.show(this.templateRef);
      // }, 5000);

    } else {
      var employmentDetails = this.employmentForm.value.clientEmploymentDetails;
      employmentDetails.map((element, key) => {
        delete element.isEditable;
        const id = key + 1;
        element.employment_id = id.toString();
        if (element.start_date != '') {
          element.start_date = moment(element.start_date).format("MM/DD/YYYY");;
          // element.start_date = this.format(element.start_date);
        }
        if (element.end_date != "") {
          element.end_date = moment(element.end_date).format("MM/DD/YYYY");;
          // element.start_date = this.format(element.end_date);

        }
      });
      console.log(this.saveIndividuals.addToIndividual(this.employmentForm.value));
    }
  }

  getFormattedDate(date) {
    return !!date ? moment(date).format('MM/DD/YYYY') : '';
  }

}
