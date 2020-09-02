import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Constants } from '../configuration/constants';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { IndividualDetailServiceService } from '../individual-detail-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-new-individual',
  templateUrl: './new-individual.component.html',
  styleUrls: ['./new-individual.component.scss']
})
export class NewIndividualComponent implements OnInit {

  @ViewChild('mediumModalContent', { static: true }) modal: TemplateRef<any>;

  successMessage: string;
  success: boolean = false;
  individualForm: FormGroup;
  firstName: string;
  middleName: string;
  lastName: string;
  DOB: string;
  sex: string;
  ssn: string;
  weight: string;
  feet: string;
  inches: string;
  mpUserId: string;
  mpPassword: string;
  driverState: string;
  driverNumber: string;
  clienttype: string
  notes: string;
  modalMessage: string;
  modalRef: BsModalRef;
  states: any;
  clientType: any;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private modalService: BsModalService, private saveIndividuals: IndividualDetailServiceService, private spinner: NgxSpinnerService, private fb: FormBuilder, private api: ApiService, public Router: Router, public States: Constants) {
    this.states = States.stateValue;
  }

  ngOnInit() {
        // this.getConstants();
    this.buildIndividualForm();
  }

  redirect() {
    this.Router.navigate(['/individuals']);
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
    });

    const getClientDetail = JSON.parse(localStorage.getItem('ClientDetails'));

    if (getClientDetail) {
      const Client = getClientDetail.clientDetails[0];
      this.firstName = Client.first_name;
      this.middleName = Client.middle_name;
      this.lastName = Client.last_name;
      this.DOB = Client.DOB;
      this.sex = Client.sex;
      this.ssn = Client.ssn;
      this.weight = Client.weight;
      this.feet = Client.height_feet;
      this.inches = Client.height_inches;
      this.mpUserId = Client.mp_user_id;
      this.mpPassword = Client.mp_password;
      this.driverState = Client.driver_license_state;
      this.driverNumber = Client.driver_license_number;
      this.clienttype = Client.client_type;
      this.notes = Client.notes;
    }
  }

  setViewDetails() {
    //setting for edit profile
    if (localStorage.getItem('ClientDetails')) {

      // const ContactsDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientContactDetails;

      // ContactsDetails.map(element => {
      //   this.contacts.push(this.fb.group({
      //     phone: element.phone,
      //     email: element.email,
      //     contact_type: element.contact_type,
      //   }));
      // });
      // this.contacts.removeAt(0);


      // const AddressDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientAddressDetails;

      // AddressDetails.map(element => {
      //   this.address.push(this.fb.group({
      //     number: element.number,
      //     street: element.street,
      //     suite: element.suite,
      //     city: element.city,
      //     state: element.state,
      //     zip: element.zip,
      //     address_type: element.address_type,
      //     from_date: element.from_date,
      //     to_date: element.to_date
      //   }));
      // });
      // this.address.removeAt(0);

      // const EnployerDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientEmploymentDetails;

      // EnployerDetails.map(element => {
      //   this.employer.push(this.fb.group({
      //     employer_name: element.employer_name,
      //     employer_phone: element.employer_phone,
      //     income_amount: element.income_amount,
      //     income_frequency: element.income_frequency,
      //     start_date: element.start_date,
      //     end_date: element.end_date
      //   }));
      // });
      // this.employer.removeAt(0);

      // const PaymentDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientPaymentMethods;

      // PaymentDetails.map(element => {
      //   this.payment.push(this.fb.group({
      //     payment_type: element.payment_type,
      //     account_number: element.account_number,
      //     account_name: element.account_name,
      //     routing_number: element.routing_number,
      //     cvv: element.cvv,
      //     expiry_month: element.expiry_month,
      //     expiry_year: element.expiry_year,
      //     valid: element.valid,
      //   }));
      // });
      // this.payment.removeAt(0);

      // const DocumentDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientDocumentDetails;

      // DocumentDetails.map(element => {
      //   this.document.push(this.fb.group({
      //     attachment_type: element.attachment_type,
      //     attachment_description: element.attachment_description,
      //     attachment_location: element.attachment_location,
      //   }));
      // });
      // this.document.removeAt(0);

    }
  }

  /**
   * get constants 
   */
  getConstants() {
    this.clientType = JSON.parse(localStorage.getItem('constants')).clientType;
    // const Obj = {
    //   userId: localStorage.getItem('userId')
    // }
    // this.api.getConstants(Obj).subscribe((data: any) => {
    //   if (data.responseCode === 200) {
    //     localStorage.setItem('constants', JSON.stringify(data.result));
    //     this.clientType = data.result.clientType;
    //   }
    // });
    // this.api.documentDropDownValues(Obj).subscribe((data: any) => {
    //   if (data.responseCode === 200) {
    //     localStorage.setItem('docType', JSON.stringify(data.result));
    //   }
    // });
  }

  format = (input) => {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, '$2/$3/$1');
  };

  onSubmit() {
    if (this.individualForm.valid) {
      this.individualForm.value.userId = localStorage.getItem('userId');
      this.individualForm.value.DOB = new Date(this.individualForm.value.DOB).toISOString().split('T')[0];
      this.individualForm.value.DOB = this.format(this.individualForm.value.DOB);
      this.individualForm.value.height_feet = this.individualForm.value.height_feet.toString();
      this.individualForm.value.height_inches = this.individualForm.value.height_inches.toString();
      this.individualForm.value.weight = this.individualForm.value.weight.toString();
      console.log(this.saveIndividuals.addToIndividual(this.individualForm.value));
    }
  }

  submit() {
    this.individualForm.value.height_feet = this.individualForm.value.height_feet.toString();
    this.individualForm.value.height_inches = this.individualForm.value.height_inches.toString();
    this.individualForm.value.weight = this.individualForm.value.weight.toString();
    console.log(this.saveIndividuals.addToIndividual(this.individualForm.value));
    var obj: any = this.saveIndividuals.getIndividual();
    obj.userId = localStorage.getItem('userId');

    if (localStorage.getItem('ClientDetails')) {

      obj.client_id = JSON.parse(localStorage.getItem('ClientDetails')).clientDetails[0].client_id;

      this.api.updateClient(obj).subscribe((data: any) => {
        this.spinner.show();
        if (data.responseCode === 200) {
          this.spinner.hide();
          this.modalMessage = data.message;
          return this.modalRef = this.modalService.show(this.templateRef);
        } else {
          this.spinner.hide();
          this.modalMessage = data.error;
          return this.modalRef = this.modalService.show(this.templateRef);
        }
      });
    } else {
      this.api.createClient(obj).subscribe((data: any) => {
        this.spinner.show();
        if (data.responseCode === 200) {
          this.spinner.hide();
          this.modalMessage = data.message;
          return this.modalRef = this.modalService.show(this.templateRef);
        } else {
          this.spinner.hide();
          this.modalMessage = data.error;
          return this.modalRef = this.modalService.show(this.templateRef);
        }
      });
    }
  }

}
