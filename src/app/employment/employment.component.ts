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
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.scss']
})
export class EmploymentComponent implements OnInit {

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

  ngOnInit(): void {
    this.getConstants();
    this.touchedRows = [];
    this.employmentForm = this.fb.group({
      clientEmploymentDetails: this.fb.array([])
    });
    this.addRow();
  }

  ngAfterOnInit() {
    this.control = this.employmentForm.get('clientEmploymentDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      employer_name: ['', Validators.required],
      employer_phone: [''],
      income_amount: ['', Validators.required],
      income_frequency: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: [''],
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
        this.incomeFrequency = data.result.incomeFrequency;
      }
    });
  }

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
          element.start_date = new Date(element.start_date).toISOString().split('T')[0];
        }
        if (element.end_date != "") {
          element.end_date = new Date(element.end_date).toISOString().split('T')[0];
        }
      });
      console.log(this.saveIndividuals.addToIndividual(this.employmentForm.value));
    }
  }

}
