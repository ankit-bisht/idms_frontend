import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../configuration/constants';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { IndividualDetailServiceService } from '../../individual-detail-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { param } from 'jquery';

@Component({
  selector: 'app-new-individual',
  templateUrl: './new-individual.component.html',
  styleUrls: ['./new-individual.component.scss']
})
export class NewIndividualComponent implements OnInit, OnDestroy {

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
  errorModal: boolean = false;
  invalid: boolean = false;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private activatedRoute: ActivatedRoute, private modalService: BsModalService, private saveIndividuals: IndividualDetailServiceService, private spinner: NgxSpinnerService, private fb: FormBuilder, private api: ApiService, public Router: Router, public States: Constants) {
    this.states = States.stateValue;
  }

  ngOnDestroy() {
    this.updateEditStatus(1);
  }

  ngOnInit() {
    this.saveIndividuals.clearIndividual();
    this.activatedRoute.params.subscribe(params => {
      if (params.edit == 1 || params.edit == null) {
        this.userEdit = true
      }
      if (params.edit == 2) {
        this.userEdit = false
      }
    });
    this.getConstants();
    this.buildIndividualForm();
  }

  enable() {
    this.checkUpdate();
  }

  checkUpdate() {
    const Obj = {
      userId: localStorage.getItem('userId'),
      clientId: JSON.parse(localStorage.getItem('ClientDetails')).clientDetails[0].client_id
    }
    this.api.getClientAllDetails(Obj).subscribe((getdata: any) => {
      if (getdata.responseCode === 200) {
        if (getdata.result.clientDetails[0].edit == 2) {
          this.errorModal = true;
          this.modalMessage = "This individual is currently being updated by some other user.";
          return this.modalRef = this.modalService.show(this.templateRef);
        } else {
          this.updateEditStatus(2);
          this.individualForm.enable();
          this.disable = false;
        }
      }
    });
  }

  updateEditStatus(status) {
    if (localStorage.getItem('ClientDetails')) {
      const obj = {
        clientId: JSON.parse(localStorage.getItem('ClientDetails')).clientDetails[0].client_id,
        userId: localStorage.getItem('userId'),
        status: status
      }
      this.api.updateEditStatus(obj).subscribe((data: any) => {
        this.spinner.show();
        if (data.responseCode === 200) {
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.modalMessage = data.error;
          return this.modalRef = this.modalService.show(this.templateRef);
        }
      });
    }
  }

  redirect() {
    if (this.userEdit == true) {
      this.updateEditStatus(1);
    }
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
      this.weight = Client.weight ? Client.weight.toString() : '';
      this.height_feet = Client.height_feet ? Client.height_feet.toString() : '';
      this.height_inches = Client.height_inches ? Client.height_inches.toString() : '';
      this.mpUserId = Client.mp_user_id ? Client.mp_user_id : '';
      this.mpPassword = Client.mp_password ? Client.mp_password : '';
      this.driverState = Client.driver_license_state ? Client.driver_license_state : '';
      this.driverNumber = Client.driver_license_number ? Client.driver_license_number : '';
      this.clienttype = Client.client_type ? Client.client_type : '';
      this.notes = Client.notes ? Client.notes : '';
    }
  }

  openDelete() {
    this.deleteClient = true;
    this.modalMessage = 'Are you sure you want to delete this Individual?';
    return this.modalRef = this.modalService.show(this.templateRef);
  }

  setDelete(value) {
    this.deleteClient = value;
  }

  delete() {
    if (this.deleteClient) {
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
          this.errorModal = true;
          this.modalMessage = data.error;
          return this.modalRef = this.modalService.show(this.templateRef);
        }
      });
    }
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

  validate(finalIndividual) {
    var finalIndividual: any = this.saveIndividuals.getIndividual();

    if (finalIndividual.hasOwnProperty("clientContactDetails")) {
      finalIndividual.clientContactDetails.some(ele => {
        if (!ele.contact_type) {
          this.modalMessage = 'Please fill all the mandatory fields in Contact Form!!';
          this.errorModal = true;
          this.invalid = true;
          return this.modalRef = this.modalService.show(this.templateRef)
        } else {
          this.invalid = false;
        }
      });
    }
    if (!this.invalid) {
      if (finalIndividual.hasOwnProperty("clientAddressDetails")) {
        finalIndividual.clientAddressDetails.some(ele => {
          if (!ele.address_type || !ele.number || !ele.street || !ele.city || !ele.state || !ele.zip) {
            this.modalMessage = 'Please fill all the mandatory fields in Address Form!!';
            this.errorModal = true;
            this.invalid = true;
            return this.modalRef = this.modalService.show(this.templateRef)
          } else {
            this.invalid = false;
          }
        });
      }
      if (!this.invalid) {
        if (finalIndividual.hasOwnProperty("clientEmploymentDetails")) {
          finalIndividual.clientEmploymentDetails.map(ele => {
            if (!ele.employer_name || !ele.income_amount || !ele.income_frequency || !ele.start_date) {
              this.modalMessage = 'Please fill all the mandatory fields in Employment Form!!';
              this.errorModal = true;
              this.invalid = true;
              return this.modalRef = this.modalService.show(this.templateRef)
            } else {
              this.invalid = false;
            }
          });
        }
        if (!this.invalid) {
          if (finalIndividual.hasOwnProperty("clientPaymentMethods")) {
            finalIndividual.clientPaymentMethods.map(ele => {
              if (!ele.payment_type || !ele.account_name || !ele.account_number || !ele.valid) {
                this.modalMessage = 'Please fill all the mandatory fields in Payment Form!!';
                this.errorModal = true;
                this.invalid = true;
                return this.modalRef = this.modalService.show(this.templateRef)
              } else {
                this.invalid = false;
              }
            });
          }
          if (!this.invalid) {
            if (finalIndividual.hasOwnProperty("clientAttachmentDetails")) {
              finalIndividual.clientAttachmentDetails.map(ele => {
                if (!ele.attachment_type || !ele.attachment_location) {
                  this.modalMessage = 'Please fill all the mandatory fields in Attachment Form!!';
                  this.errorModal = true;
                  this.invalid = true;
                  return this.modalRef = this.modalService.show(this.templateRef)
                } else {
                  this.invalid = false;
                }
              });
            }
            if (!this.invalid) {
              if (finalIndividual.hasOwnProperty("clientDocumentDetails")) {
                finalIndividual.clientDocumentDetails.map(ele => {
                  if (!ele.document_type_id || !ele.due_date || !ele.status) {
                    this.modalMessage = 'Please fill all the mandatory fields in Document Form!!';
                    this.errorModal = true;
                    this.invalid = true;
                    return this.modalRef = this.modalService.show(this.templateRef)
                  } else {
                    this.invalid = false;
                  }
                });
              }
              if (!this.invalid) {
                if (finalIndividual.hasOwnProperty("clientRelationShipDetails")) {
                  finalIndividual.clientRelationShipDetails.map(ele => {
                    if (!ele.relationshipId || !ele.id2) {
                      this.modalMessage = 'Please fill all the mandatory fields in Relationship Form!!';
                      this.errorModal = true;
                      this.invalid = true;
                      return this.modalRef = this.modalService.show(this.templateRef)
                    } else {
                      this.invalid = false;
                    }
                  });
                }
              }
            }
          }
        }
      }
    }

    if (!this.invalid) {
      this.submit();
    }
  }

  submit() {
    this.individualForm.value.DOB = new Date(this.individualForm.value.DOB).toISOString().split('T')[0];
    this.individualForm.value.DOB = this.format(this.individualForm.value.DOB);
    this.individualForm.value.weight = this.individualForm.value.weight ? this.individualForm.value.weight.toString() : '';
    this.saveIndividuals.addToIndividual(this.individualForm.value);

    this.saveIndividuals.getIndividual()['clientPaymentMethods'] &&
      this.saveIndividuals.getIndividual()['clientPaymentMethods'].length > 0 &&
      this.saveIndividuals.getIndividual()['clientPaymentMethods'].map((element, key) => {
        delete element.isEditable;
        const id = key + 1;
        element.payment_method_id = id.toString();
      });

    console.log(this.saveIndividuals.addToIndividual(this.saveIndividuals.getIndividual()));

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
            this.updateEditStatus(1);
            localStorage.setItem('ClientDetails', JSON.stringify(getdata.result));
          }
          if (data.responseCode === 200) {
            this.spinner.hide();
            this.individualForm.disable();
            this.saveIndividuals.clearIndividual();
            this.disable = true;
            this.errorModal = false;
            this.modalMessage = data.message;
            return this.modalRef = this.modalService.show(this.templateRef);
          } else {
            this.spinner.hide();
            this.errorModal = true;
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
          this.saveIndividuals.clearIndividual();
          this.disable = true;
          this.errorModal = false;
          this.modalMessage = data.message;
          return this.modalRef = this.modalService.show(this.templateRef);
        } else {
          this.spinner.hide();
          this.modalMessage = data.error;
          this.errorModal = true;
          return this.modalRef = this.modalService.show(this.templateRef);
        }
      });
    }
  }

  updateDetails() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(params => {
      this.spinner.hide();
      if (params.edit == 0) {
        this.modalService.hide(1);
        this.saveIndividuals.clearIndividual();
        window.location.reload();
      } else {
        const Obj = {
          userId: localStorage.getItem('userId'),
          clientId: JSON.parse(localStorage.getItem('ClientDetails')).clientDetails[0].client_id
        }
        this.api.getClientAllDetails(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            this.spinner.hide();
            localStorage.setItem('ClientDetails', JSON.stringify(data.result));
            this.saveIndividuals.clearIndividual();
            window.location.reload();
          }
        });
      }
    });
  }

}
