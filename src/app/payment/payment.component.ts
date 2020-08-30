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
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentForm: FormGroup;
  control: FormArray;
  mode: boolean;
  paymentType: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  year = new Date().getFullYear();
  range = [];
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) { }

  ngOnInit(): void {
    this.getConstants();
    this.touchedRows = [];
    this.paymentForm = this.fb.group({
      clientPaymentMethods: this.fb.array([])
    });
    this.addRow();
    for (var i = 0; i < 25; i++) {
      this.range.push(this.year + i,);
    }

  }

  ngAfterOnInit() {
    this.control = this.paymentForm.get('clientPaymentMethods') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      payment_type: ['', Validators.required],
      account_number: ['', Validators.required],
      account_name: ['', Validators.required],
      routing_number: [''],
      cvv: [''],
      expiry_month: [''],
      expiry_year: [''],
      valid: ['', Validators.required],
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
        this.paymentType = data.result.paymentType;
      }
    });
  }

  addRow() {
    const control = this.paymentForm.get('clientPaymentMethods') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.paymentForm.get('clientPaymentMethods') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  get getFormControls() {
    const control = this.paymentForm.get('clientPaymentMethods') as FormArray;
    return control;
  }

  disableField(index) {

    const Form = this.paymentForm.controls.clientPaymentMethods['controls'][index].controls;
    if (Form.payment_type.value == '4' || Form.payment_type.value == '5') {
      Form.expiry_year.disable();
      Form.cvv.disable();
      Form.expiry_month.disable();
      Form.routing_number.enable();
    } else {
      Form.routing_number.disable();
      Form.expiry_year.enable();
      Form.cvv.enable();
      Form.expiry_month.enable();
    }
  }

  submitForm() {
    const control = this.paymentForm.get('clientPaymentMethods') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    if (!this.paymentForm.valid) {
      // setTimeout(() => {
      //   this.modalMessage = "Please Fill All Details Correctly!!"
      //   return this.modalRef = this.modalService.show(this.templateRef);
      // }, 5000);

    } else {
      var contactsDetails = this.paymentForm.value.clientPaymentMethods;
      contactsDetails.map((element, key) => {
        delete element.isEditable;
        const id = key + 1;
        element.payment_method_id = id.toString();
      });
      console.log(this.saveIndividuals.addToIndividual(this.paymentForm.value));
    }
  }
}
