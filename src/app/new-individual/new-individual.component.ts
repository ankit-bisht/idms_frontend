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
  DOB: any;
  sex: string;
  ssn: string;
  weight: string;
  height_feet: string;
  height_inches: string;
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
  disable: boolean = false;
  userEdit: Boolean = false;
  deleteClient: boolean = false;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private modalService: BsModalService, private saveIndividuals: IndividualDetailServiceService, private spinner: NgxSpinnerService, private fb: FormBuilder, private api: ApiService, public Router: Router, public States: Constants) {
    this.states = States.stateValue;
  }

  ngOnInit() {
    this.getConstants();
    this.buildIndividualForm();
  }

  enable() {
    this.individualForm.enable();
    this.disable = false;
  }


  redirect() {
    this.Router.navigate(['/individuals']);
  }

  buildIndividualForm(): void {

    this.individualForm = new FormGroup({
      "first_name": new FormControl('', [Validators.required]),
      "middle_name": new FormControl(''),
      "last_name": new FormControl('', [Validators.required]),
      "DOB": new FormControl('', [Validators.required]),
      "sex": new FormControl('', [Validators.required]),
      "ssn": new FormControl(''),
      "height_feet": new FormControl(''),
      "height_inches": new FormControl(''),
      "weight": new FormControl(''),
      "mp_user_id": new FormControl(''),
      "mp_password": new FormControl(''),
      "driver_license_state": new FormControl(''),
      "driver_license_number": new FormControl(''),
      "client_type": new FormControl(''),
      "notes": new FormControl(''),
    });

    let getClientDetail = JSON.parse(localStorage.getItem('ClientDetails'));


    if (getClientDetail) {
      const Client = getClientDetail.clientDetails[0];

      this.individualForm.disable();
      this.disable = true;

      this.firstName = Client.first_name;
      this.middleName = Client.middle_name ? Client.middle_name : '';
      this.lastName = Client.last_name;
      this.DOB = new Date(Client.DOB);
      this.sex = Client.sex ? Client.sex : '';
      this.ssn = Client.ssn ? Client.ssn : '';
      this.weight = Client.weight ? Client.weight : '';
      this.height_feet = Client.height_feet ? Client.height_feet : '';
      this.height_inches = Client.height_inches ? Client.height_inches : '';
      this.mpUserId = Client.mp_user_id ? Client.mp_user_id : '';
      this.mpPassword = Client.mp_password ? Client.mp_password : '';
      this.driverState = Client.driver_license_state ? Client.driver_license_state : '';
      this.driverNumber = Client.driver_license_number ? Client.driver_license_number : '';
      this.clienttype = Client.client_type ? Client.client_type : '';
      this.notes = Client.notes ? Client.notes : '';

      if (Client.user_id == JSON.parse(localStorage.getItem('userId'))) {
        this.userEdit = true;
      }
    }
  }

  openDelete() {
    this.deleteClient = true;
    this.modalMessage = 'Are you sure you want to delete this Individual?';
    return this.modalRef = this.modalService.show(this.templateRef);
  }

  delete() {
    this.modalService.hide(1);
    const obj = {
      clientId: JSON.parse(localStorage.getItem('ClientDetails')).clientDetails[0].client_id,
      userId: localStorage.getItem('userId')
    }
    this.api.deleteClient(obj).subscribe((data: any) => {
      this.spinner.show();
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.redirect();
      } else {
        this.spinner.hide();
        this.modalMessage = data.error;
        return this.modalRef = this.modalService.show(this.templateRef);
      }
    });
  }

  /**
   * get constants 
   */
  getConstants() {
    this.clientType = JSON.parse(localStorage.getItem('constants')).clientType;
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
      console.log(this.saveIndividuals.addToIndividual(this.individualForm.value));
    }
  }

  submit() {
    this.individualForm.value.DOB = new Date(this.individualForm.value.DOB).toISOString().split('T')[0];
    this.individualForm.value.DOB = this.format(this.individualForm.value.DOB);
    this.individualForm.value.weight = this.individualForm.value.weight ? this.individualForm.value.weight.toString() : '';
    console.log(this.saveIndividuals.addToIndividual(this.individualForm.value));
    var obj: any = this.saveIndividuals.getIndividual();
    obj.userId = localStorage.getItem('userId');
    delete obj.height;

    if (localStorage.getItem('ClientDetails')) {

      obj.client_id = JSON.parse(localStorage.getItem('ClientDetails')).clientDetails[0].client_id;

      this.api.updateClient(obj).subscribe((data: any) => {
        this.spinner.show();
        const Obj = {
          userId: localStorage.getItem('userId'),
          clientId: JSON.parse(localStorage.getItem('ClientDetails')).clientDetails[0].client_id
        }
        this.api.getClientAllDetails(Obj).subscribe((getdata: any) => {
          if (getdata.responseCode === 200) {
            this.spinner.hide();
            localStorage.setItem('ClientDetails', JSON.stringify(getdata.result));
          }
          if (data.responseCode === 200) {
            this.spinner.hide();
            this.individualForm.disable();
            this.disable = true;
            this.modalMessage = data.message;
            return this.modalRef = this.modalService.show(this.templateRef);
          } else {
            this.spinner.hide();
            this.modalMessage = data.error;
            return this.modalRef = this.modalService.show(this.templateRef);
          }
        });

      });
    } else {
      this.api.createClient(obj).subscribe((data: any) => {
        this.spinner.show();
        if (data.responseCode === 200) {
          this.spinner.hide();
          this.individualForm.disable();
          this.disable = true;
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
