import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Constants } from '../configuration/constants';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { element } from 'protractor';
import { LOADIPHLPAPI } from 'dns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-new-individual',
  templateUrl: './new-individual.component.html',
  styleUrls: ['./new-individual.component.scss']
})
export class NewIndividualComponent implements OnInit {

  clientType: any;
  contactype: any;
  addresstype: any;
  paymentType: any;
  docType: any;
  incomeFrequency: any;
  showContacts: boolean = false;
  showPayment: boolean = false;
  showRelations: boolean = false;
  showAttachment: boolean = true;
  showEmployemment: boolean = false;
  showAddress: boolean = false;

  FormError: string;

  contactError: Boolean = false;
  contactFormError: string;
  contactMessage: string;
  contactSuccess: boolean = false;
  contactForm: FormGroup;

  successMessage: string;
  success: boolean = false;
  individualForm: FormGroup;

  addressForm: FormGroup;
  addressError: Boolean = false;
  addressFormError: string;
  addressMessage: string;
  addressSuccess: boolean = false;

  employerForm: FormGroup;
  employerError: Boolean = false;
  employerFormError: string;
  employerMessage: string;
  employerSuccess: boolean = false;

  paymentForm: FormGroup;
  paymentError: Boolean = false;
  paymentFormError: string;
  paymentMessage: string;
  paymentSuccess: boolean = false;

  documentForm: FormGroup;
  documentError: Boolean = false;
  documentFormError: string;
  documentMessage: string;
  documentSuccess: boolean = false;

  states: any;
  city: any[] = [];

  constructor(private spinner: NgxSpinnerService, private modalService: NgbModal, private fb: FormBuilder, private api: ApiService, public Router: Router, public States: Constants) {
    this.states = States.stateValue;
  }

  ngOnInit() {
    this.getConstants();
    this.buildIndividualForm();


    this.contactForm = this.fb.group({
      contacts: this.fb.array([this.fb.group({
        phone_no: '',
        email: '',
        contact_type: '',
      })])
    });

    this.addressForm = this.fb.group({
      address: this.fb.array([this.fb.group({
        number: "",
        street: "",
        suite: "",
        city: "",
        state: "",
        zip: "",
        address_type: "",
        from_date: "",
        to_date: ""
      })])
    });

    this.employerForm = this.fb.group({
      employer: this.fb.array([this.fb.group({
        employer_name: "",
        employer_phone: "",
        income_amount: "",
        income_frequency: "",
        start_date: "",
        end_date: ""
      })])
    });

    this.paymentForm = this.fb.group({
      payment: this.fb.array([this.fb.group({
        payment_type: "",
        account_number: "",
        account_name: "",
        routing_number: "",
        cvv: "",
        expiry_month: "",
        expiry_year: "",
        valid: "",
      })])
    });

    this.documentForm = this.fb.group({
      document: this.fb.array([this.fb.group({
        document_type_id: "",
        due_date: "",
        date_submitted: "",
        status: "",
      })])
    });
  }

  openMediumModal(mediumModalContent) {
    this.modalService.open(mediumModalContent);
  }

  buildIndividualForm(): void {
    this.individualForm = new FormGroup({
      "first_name": new FormControl('', [
        Validators.required
      ]),
      "middle_name": new FormControl('', [
      ]),
      "last_name": new FormControl('', [
        Validators.required
      ]),
      "DOB": new FormControl('', [
        Validators.required
      ]),
      "sex": new FormControl('', [
        Validators.required
      ]),
      "ssn": new FormControl('', [
        Validators.required
      ]),
      "height_inches": new FormControl('', [
        Validators.required
      ]),
      "height_feet": new FormControl('', [
        Validators.required
      ]),
      "weight": new FormControl('', [
        Validators.required
      ]),
      "mp_user_id": new FormControl('', [
        Validators.required
      ]),
      "mp_password": new FormControl('', [
        Validators.required
      ]),
      "driver_license_state": new FormControl('', [
        Validators.required
      ]),
      "driver_license_number": new FormControl('', [
        Validators.required
      ]),
      "client_type": new FormControl('', [
        Validators.required
      ]),
      "notes": new FormControl('', [
        Validators.required
      ]),
    })
  }


  /**
   * get constants 
   */
  getConstants() {
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getConstants(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.contactype = data.result.contactType;
        this.clientType = data.result.clientType;
        this.addresstype = data.result.addressType;
        this.incomeFrequency = data.result.incomeFrequency;
        this.paymentType = data.result.paymentType;
      }
    });
    this.api.documentDropDownValues(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.docType = data.result;
      }
    });
  }

  /**
   * INDIVIDUALS
   */
  saveIndividualDetails() {
    this.individualForm.value.DOB = new Date(this.individualForm.value.DOB).toISOString().split('T')[0];
    this.individualForm.value.userId = localStorage.getItem('userId');
    localStorage.setItem('individualDetails', JSON.stringify(this.individualForm.value));
    this.success = true;
    this.successMessage = "Details has been saved succesfully!";
    this.showContacts = true;
  }

  /**
   * DOCUMENT
   */
  get document() {
    return this.documentForm.get('document') as FormArray;
  }

  addDocument() {
    this.document.push(this.fb.group({
      document_type_id: "",
      due_date: "",
      date_submitted: "",
      status: "",
    }));
  }

  deleteDocument(index) {
    this.document.removeAt(index);
  }

  saveDocument() {
    this.document.value.map(
      element => {
        if (element.document_type_id === '' || element.due_date === '' || element.date_submitted === '' || element.status === '') {
          this.documentError = true;
          return this.documentFormError = 'Please fill all fields!!';
        } else {
          element.date_submitted = new Date(element.date_submitted).toISOString().split('T')[0];
          element.due_date = new Date(element.due_date).toISOString().split('T')[0];

          this.documentError = false;
        }

      }
    );

    if (!this.documentError) {
      var getDetail = JSON.parse(localStorage.getItem('individualDetails'));
      getDetail.clientDocumentDetails = this.document.value;
      localStorage.setItem('individualDetails', JSON.stringify(getDetail));


      //createClient
      const Obj = JSON.parse(localStorage.getItem('individualDetails'));
      this.api.createClient(Obj).subscribe((data: any) => {
        this.spinner.show();
        if (data.responseCode === 200) {
          this.spinner.hide();
          this.documentSuccess = true;
          this.documentMessage = data.message;
        } else {
          this.spinner.hide();
          this.documentError = true;
          return this.documentFormError = data.error;
        }
      });

    }
  }


  /**
   * PAYMENT
   */
  get payment() {
    return this.paymentForm.get('payment') as FormArray;
  }

  addPayment() {
    this.payment.push(this.fb.group({
      payment_type: "",
      account_number: "",
      account_name: "",
      routing_number: "",
      cvv: "",
      expiry_month: "",
      expiry_year: "",
      valid: "",
    }));
  }

  deletePayment(index) {
    this.payment.removeAt(index);
  }

  savePayment() {
    this.payment.value.map(
      element => {
        if (element.payment_type === '' || element.account_number === '' || element.account_name === '' || element.routing_number === ''
          || element.cvv === '' || element.expiry_month === '' || element.expiry_year === '' || element.valid === '') {
          this.paymentError = true;
          return this.paymentFormError = 'Please fill all fields!!';
        } else {
          this.paymentError = false;
        }

      }
    );

    if (!this.paymentError) {
      var getDetail = JSON.parse(localStorage.getItem('individualDetails'));
      getDetail.clientPaymentMethods = this.payment.value;
      localStorage.setItem('individualDetails', JSON.stringify(getDetail));
      this.showAttachment = true;
      this.paymentSuccess = true;
      this.paymentMessage = "Details has been saved succesfully!";
    }
  }

  /**
   * EMPLOYER
   */
  get employer() {
    return this.employerForm.get('employer') as FormArray;
  }

  addEmployer() {
    this.employer.push(this.fb.group({
      employer_name: "",
      employer_phone: "",
      income_amount: "",
      income_frequency: "",
      start_date: "",
      end_date: ""
    }));
  }

  deleteEmployer(index) {
    this.employer.removeAt(index);
  }

  saveEmployer() {
    this.employer.value.map(
      element => {
        if (element.employer_name === '' || element.employer_phone === '' || element.income_amount === '' || element.income_frequency === ''
          || element.start_date === '' || element.end_date === '') {
          this.employerError = true;
          return this.employerFormError = 'Please fill all fields!!';
        } else {
          element.start_date = new Date(element.start_date).toISOString().split('T')[0];
          element.end_date = new Date(element.end_date).toISOString().split('T')[0];
          this.employerError = false;
        }
      }
    );

    if (!this.employerError) {
      var getDetail = JSON.parse(localStorage.getItem('individualDetails'));
      getDetail.clientEmploymentDetails = this.employer.value;
      localStorage.setItem('individualDetails', JSON.stringify(getDetail));
      this.showPayment = true;
      this.employerSuccess = true;
      this.employerMessage = "Details has been saved succesfully!";
    }
  }

  /**
   * ADDRESS
   */
  get address() {
    return this.addressForm.get('address') as FormArray;
  }

  addAddress() {
    this.address.push(this.fb.group({
      number: "",
      street: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
      address_type: "",
      from_date: "",
      to_date: ""
    }));
  }

  deleteAddress(index) {
    this.address.removeAt(index);
  }

  setCity() {
    console.log("hii");

    this.States.states.states.map(element => {
      element.districts.map(value => {
        this.city.push(value);
      })
    });
  }

  saveAddress() {
    this.address.value.map(
      element => {
        if (element.number === '' || element.street === '' || element.suite === '' || element.city === ''
          || element.state === '' || element.zip === '' || element.address_type === '' || element.from_date === '' || element.to_date === '') {
          this.addressError = true;
          return this.addressFormError = 'Please fill all fields!!';
        } else {
          element.from_date = new Date(element.from_date).toISOString().split('T')[0];
          element.to_date = new Date(element.to_date).toISOString().split('T')[0];
          this.addressError = false;
        }
      }
    );

    if (!this.addressError) {
      var getDetail = JSON.parse(localStorage.getItem('individualDetails'));
      getDetail.clientAddressDetails = this.address.value;
      localStorage.setItem('individualDetails', JSON.stringify(getDetail));
      this.showEmployemment = true;
      this.addressSuccess = true;
      this.addressMessage = "Details has been saved succesfully!";
    }
  }

  /**
   * CONTACTS
   */
  get contacts() {
    return this.contactForm.get('contacts') as FormArray;
  }

  addContacts() {
    this.contacts.push(this.fb.group({
      phone_no: '',
      email: '',
      contact_type: '',
    }));
  }

  deleteContacts(index) {
    this.contacts.removeAt(index);
  }

  saveContacts() {
    this.contacts.value.map(
      element => {
        if (element.phone_no === '' || element.email === '' || element.contact_type === '') {
          this.contactError = true;
          return this.contactFormError = 'Please fill all fields!!';
        }
        var patt = new RegExp(/\S+@\S+\.\S+/);
        if (!patt.test(element.email)) {
          this.contactError = true;
          return this.contactFormError = 'Please enter correct Email Format!';
        } else {
          this.contactError = false;
        }
      }
    );

    if (!this.contactError) {
      var getDetail = JSON.parse(localStorage.getItem('individualDetails'));
      getDetail.clientContactDetails = this.contacts.value;
      localStorage.setItem('individualDetails', JSON.stringify(getDetail));
      this.showAddress = true;
      this.contactSuccess = true;
      this.contactMessage = "Details has been saved succesfully!";
    }
  }

}
