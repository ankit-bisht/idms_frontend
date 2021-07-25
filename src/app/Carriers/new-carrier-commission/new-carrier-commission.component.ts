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
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-new-carrier-commission',
  templateUrl: './new-carrier-commission.component.html',
  styleUrls: ['./new-carrier-commission.component.scss']
})
export class NewCarrierCommissionComponent implements OnInit {

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
  years: number[] = [];
  currentYear: number = new Date().getFullYear();

  months = ["months", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  displayedColumns = ['address_type', 'number', 'street', 'city', 'state', 'zip'];
  dataSource: any;
  length: any = 0;

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private modalService: BsModalService, private api: ApiService, private saveGroup: IndividualDetailServiceService) { }

  @Input() disable: boolean;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.commissionForm = this.fb.group({
      carrierCommissionDetails: this.fb.array([])
    });
    // if (localStorage.getItem('CarrierDetails')) {
    //   if (JSON.parse(localStorage.getItem('CarrierDetails')).carrierCommissionDetails.length >= 1) {
    //     this.setDetails();
    //   }
    // }

    if (disable.disable.currentValue) {
      this.commissionForm.disable();
    } else {
      this.commissionForm.enable();
    }
    // this.dataSource = new MatTableDataSource(this.filteredClients);
    // this.length = this.filteredClients.length;
  }

  ngOnInit() {
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      'file': new FormControl('', [Validators.required]),
      "date": new FormControl({ disabled: true, value: new Date() }, [Validators.required]),
      "month": new FormControl('', [Validators.required]),
      "year": new FormControl('', [Validators.required]),
      isEditable: [true]
    });
  }

  getConstants() {
    for (let i = (this.currentYear - 15); i < (this.currentYear + 15); i++) {
      this.years.push(i);
    }
    this.contactype = JSON.parse(localStorage.getItem('constants')).contactType;
  }

  addRow() {
    const control = this.commissionForm.get('carrierCommissionDetails') as FormArray;
    control.push(this.initiateForm());
  }

  setDetails() {
    const control = this.commissionForm.get('carrierCommissionDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('CarrierDetails')).carrierCommissionDetails;

    Details.map(element => {
      control.push(this.setForm(element));
    });
    this.commissionForm.value.carrierCommissionDetails.map((element, key) => {
      const id = key + 1;
      element.contact_id = id.toString();
      delete element.isEditable;
    });
    this.saveGroup.addToCarrier(this.commissionForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      file: [element.file],
      date: [element.date],
      month: [element.month],
      year: [element.year],
      isEditable: [false]
    });
  }

  disableField(index) {
    const Form = this.commissionForm.controls.carrierCommissionDetails['controls'][index].controls;
    if (Form.contact_type.value == '1' || Form.contact_type.value == '2') {
      Form.phone.disable();
      Form.email.enable();
    } else {
      Form.email.disable();
      Form.phone.enable();
    }
  }

  getIndividual(val) {

  }

  deleteRow(index: number) {
    const control = this.commissionForm.get('carrierCommissionDetails') as FormArray;
    control.removeAt(index);
    this.submitForm();
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  setValue(group: FormGroup, address_id) {
    group.get('address_id').setValue(address_id);
    console.log(this.saveGroup.addToCarrier(this.commissionForm.value));
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  saveFile(file, index) {
    const File = file[0];
    this.commissionForm.controls.carrierCommissionDetails['controls'][index].controls.file.value = File.name;
  }

  uploadFile(file, index) {
    let form = this.commissionForm.controls.carrierCommissionDetails['controls'][index].controls;
    if (!form.month.value) {
      this.modalMessage = 'Please fill month';
      return this.modalRef = this.modalService.show(this.templateRef);
    }
    if (!form.year.value) {
      this.modalMessage = "please fill year";
      return this.modalRef = this.modalService.show(this.templateRef);
    }

    const File = file[0];
    const formData = new FormData();
    formData.append('file', File, File.name);
    formData.append('userId', localStorage.getItem('userId'));
    formData.append('year', form.year.value);
    formData.append('month', form.month.value);
    if (localStorage.getItem('CarrierDetails'))
      formData.append('carrier_id', JSON.parse(localStorage.getItem('CarrierDetails')).carrierBaseDetails[0].carrier_id);

    this.spinner.show();

    this.api.uploadCommissionFile(formData).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        // const form = this.commissionForm.get('carrierCommissionDetails') as FormArray;
        // form.controls[index].patchValue({
        //   attachment_type: File.type,
        // });

        this.modalMessage = data.message;
        return this.modalRef = this.modalService.show(this.templateRef);
      } else {
        this.spinner.hide();
        this.modalMessage = data.error;
        return this.modalRef = this.modalService.show(this.templateRef);
      }
    });
    this.submitForm();
  }


  getDate(value) {
    return JSON.stringify(new Date(value)).slice(1, 11);
  }

  get getFormControls() {
    const control = this.commissionForm.get('carrierCommissionDetails') as FormArray;
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
    const control = this.commissionForm.get('carrierCommissionDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    var contactsDetails = this.commissionForm.value.carrierCommissionDetails;
    contactsDetails.map((element, key) => {
      delete element.isEditable;
      element.date = new Date().toLocaleDateString();
      const id = key + 1;
    });
    console.log(this.saveGroup.addToCarrier(this.commissionForm.value));
  }
}
