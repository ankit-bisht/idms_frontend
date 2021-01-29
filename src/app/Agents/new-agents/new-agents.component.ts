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
  selector: 'app-new-agents',
  templateUrl: './new-agents.component.html',
  styleUrls: ['./new-agents.component.scss']
})
export class NewAgentsComponent implements OnInit, OnDestroy {

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
  agentState: string;
  agentNumber: string;
  nationalNumber: string;
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
      agent_id: JSON.parse(localStorage.getItem('AgentDetails'))[0].agent_id
    }
    this.api.getAgentAllDetails(Obj).subscribe((getdata: any) => {
      if (getdata.responseCode === 200) {
        if (getdata.result[0].edit == 2) {
          this.errorModal = true;
          this.modalMessage = "This Agent is currently being updated by some other user.";
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
    if (localStorage.getItem('AgentDetails')) {
      const obj = {
        agent_id: JSON.parse(localStorage.getItem('AgentDetails'))[0].agent_id,
        userId: localStorage.getItem('userId'),
        status: status
      }
      this.api.updateAgentEditStatus(obj).subscribe((data: any) => {
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
    this.Router.navigate(['/agents']);
  }

  buildIndividualForm(): void {

    this.individualForm = new FormGroup({
      "first_name": new FormControl('', [Validators.required]),
      "middle_name": new FormControl(''),
      "last_name": new FormControl('', [Validators.required]),
      "DOB": new FormControl('', [Validators.required]),
      "sex": new FormControl('', [Validators.required]),
      "ssn": new FormControl('', [Validators.required]),
      "height_feet": new FormControl(''),
      "height_inches": new FormControl(''),
      "weight": new FormControl(''),
      "mp_user_id": new FormControl(''),
      "mp_password": new FormControl(''),
      "driver_license_state": new FormControl(''),
      "driver_license_number": new FormControl(''),
      "agent_license_state": new FormControl(''),
      "agent_license_number": new FormControl(''),
      "national_producer_number": new FormControl(''),
      "notes": new FormControl(''),
    });

    let getClientDetail = JSON.parse(localStorage.getItem('AgentDetails'));


    if (getClientDetail) {
      const Client = getClientDetail[0];

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
      this.agentState = Client.agent_license_state ? Client.agent_license_state : '';
      this.agentNumber = Client.agent_license_number ? Client.agent_license_number : '';
      this.nationalNumber = Client.national_producer_number ? Client.national_producer_number : '';
      this.notes = Client.notes ? Client.notes : '';
    }
  }

  openDelete() {
    this.deleteClient = true;
    this.modalMessage = 'Are you sure you want to delete this Agent?';
    return this.modalRef = this.modalService.show(this.templateRef);
  }

  delete() {
    this.modalService.hide(1);
    const obj = {
      agent_id: JSON.parse(localStorage.getItem('AgentDetails'))[0].agent_id,
      userId: localStorage.getItem('userId')
    }
    this.api.deleteAgent(obj).subscribe((data: any) => {
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
      console.log(this.saveIndividuals.addToAgent(this.individualForm.value));
    }
  }

  validate(finalIndividual) {
    var finalIndividual: any = this.saveIndividuals.getIndividual();
    this.submit();
  }

  submit() {
    this.individualForm.value.DOB = new Date(this.individualForm.value.DOB).toISOString().split('T')[0];
    this.individualForm.value.DOB = this.format(this.individualForm.value.DOB);
    this.individualForm.value.weight = this.individualForm.value.weight ? this.individualForm.value.weight.toString() : '';
    this.saveIndividuals.addToAgent(this.individualForm.value);
    var obj: any = this.saveIndividuals.getAgent();
    obj.userId = localStorage.getItem('userId');
    delete obj.height;
    if (localStorage.getItem('AgentDetails')) {

      obj.agent_id = JSON.parse(localStorage.getItem('AgentDetails'))[0].agent_id;

      this.api.updateAgent(obj).subscribe((data: any) => {
        this.spinner.show();
        const Obj = {
          userId: localStorage.getItem('userId'),
          agent_id: JSON.parse(localStorage.getItem('AgentDetails'))[0].agent_id
        }
        this.api.getAgentAllDetails(Obj).subscribe((getdata: any) => {
          if (getdata.responseCode === 200) {
            this.spinner.hide();
            this.updateEditStatus(1);
            localStorage.setItem('AgentDetails', JSON.stringify(getdata.result));
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
      this.api.createAgent(obj).subscribe((data: any) => {
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
          agent_id: JSON.parse(localStorage.getItem('AgentDetails'))[0].agent_id
        }
        this.api.getAgentAllDetails(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            this.spinner.hide();
            localStorage.setItem('AgentDetails', JSON.stringify(data.result));
            this.saveIndividuals.clearIndividual();
            window.location.reload();
          }
        });
      }
    });
  }

}
