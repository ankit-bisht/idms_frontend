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
  selector: 'app-new-policies',
  templateUrl: './new-policies.component.html',
  styleUrls: ['./new-policies.component.scss']
})
export class NewPoliciesComponent implements OnInit, OnDestroy {

  @ViewChild('mediumModalContent', { static: true }) modal: TemplateRef<any>;

  successMessage: string;
  success: boolean = false;
  policyForm: FormGroup;
  carrier: string;
  product: string;
  modalMessage: string;
  modalRef: BsModalRef;
  clientType: any;
  productList: any;
  disable: boolean = false;
  userEdit: Boolean = false;
  deleteClient: boolean = false;
  errorModal: boolean = false;
  invalid: boolean = false;
  policyType: any;
  selectedMembers: any;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private activatedRoute: ActivatedRoute, private modalService: BsModalService, private savePolicies: IndividualDetailServiceService, private spinner: NgxSpinnerService, private fb: FormBuilder, private api: ApiService, public Router: Router) {
  }

  ngOnDestroy() {
    this.updateEditStatus(1);
  }

  ngOnInit() {
    this.savePolicies.clearPolicy();
    this.activatedRoute.params.subscribe(params => {
      if (params.edit == 1 || params.edit == null) {
        this.userEdit = true;
      }
      if (params.edit == 2) {
        this.userEdit = false;
      }
    });
    this.getConstants();
    this.buildpolicyForm();
  }

  enable() {
    this.checkUpdate();
  }

  checkUpdate() {

    const Obj = {
      userId: localStorage.getItem('userId'),
      policy_id: JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails[0]["policy_id"]
    }
    this.api.getAllPoliciesDetails(Obj).subscribe((getdata: any) => {
      if (getdata.responseCode === 200) {
        if (getdata.result[0].edit == 2) {
          this.errorModal = true;
          this.disable = true;
          this.modalMessage = "This Policy is currently being updated by some other user.";
          return this.modalRef = this.modalService.show(this.templateRef);
        } else {
          this.updateEditStatus(2);
          // this.policyForm.enable();
          this.disable = false;
        }
      }
    });
  }

  updateEditStatus(status) {
    if (localStorage.getItem('PoliciesDetails')) {
      const obj = {
        policy_id: JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails[0].policy_id,
        userId: localStorage.getItem('userId'),
        status: status
      }
      this.api.updatePolicyEditStatus(obj).subscribe((data: any) => {
        if (data.responseCode === 200) {
          if (status == 1) {
            localStorage.removeItem("PoliciesDetails");
            localStorage.removeItem("policyType");
          }
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
    this.updateEditStatus(1);
    this.Router.navigate(['/policies']);
  }

  buildpolicyForm(): void {
    this.policyForm = new FormGroup({
      "carrier_id": new FormControl('', [Validators.required]),
      "product_id": new FormControl(''),
    });

    let getClientDetail = localStorage.getItem('PoliciesDetails') ? JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails : false;


    if (getClientDetail) {
      const Client = getClientDetail[0];
      this.getAllProductIds(Client.carrier_id);
      this.policyForm.disable();
      this.disable = true;
      this.carrier = Client.carrier_id;
      this.product = Client.product_id;
      console.log(this.savePolicies.addToPolicy(Client));
    }
  }

  openDelete() {
    this.deleteClient = true;
    this.modalMessage = 'Are you sure you want to delete this Policy?';
    return this.modalRef = this.modalService.show(this.templateRef);
  }

  delete() {
    this.modalService.hide(1);
    const obj = {
      policy_id: JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails[0].policy_id,
      userId: localStorage.getItem('userId')
    }
    this.api.deletePolicy(obj).subscribe((data: any) => {
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

  getPolicyConstants() {
    const obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getCarriers(obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.clientType = data.result;
      }
    });
    this.api.getAgents(obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        localStorage.setItem('Agents',JSON.stringify(data.result));
      }
    });
  }

  getAllProductIds(id) {
    const obj = {
      carrierId: id,
      userId: localStorage.getItem('userId')
    }
    this.spinner.show();
    this.api.getAllProductIds(obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.productList = data.result;
        let getClientDetail = localStorage.getItem('PoliciesDetails') ? JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails : false;


        if (getClientDetail) {
          const Client = getClientDetail[0];
          this.policyType = this.productList.filter(x => x.product_id === Client.product_id)[0].product_class;
          localStorage.setItem('policyType', this.policyType);
        }
      }
    });
  }

  /**
   * get constants
   */
  getConstants() {
    // const carrier = JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails[0].carrier_id;
    this.getPolicyConstants();
  }

  format = (input) => {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, '$2/$3/$1');
  };

  submitCarrier() {
    this.getAllProductIds(this.policyForm.value.carrier_id);
    console.log(this.savePolicies.addToPolicy(this.policyForm.value));
  }

  submitSelection(type) {
    this.policyType = type.filter(x => x.product_id === this.policyForm.value.product_id)[0].product_class;
    localStorage.setItem('policyType', this.policyType);
    console.log(this.savePolicies.addToPolicy(this.policyForm.value));
    this.policyForm.get('carrier_id').disable();
    this.policyForm.get('product_id').disable();
    // this.policyForm.disable();
  }

  onSubmit() {
    if (this.policyForm.valid) {
      this.policyForm.value.userId = localStorage.getItem('userId');
      console.log(this.savePolicies.addToPolicy(this.policyForm.value));
    }
  }

  validate() {
    var data: any = this.savePolicies.getPolicy();
    console.log(data);

    if (!('policy_number' in data) || !('status' in data)
      || data.application_date == undefined || data.effective_date == undefined
      || data.end_date == undefined || !('primary_id' in data)) {
      this.errorModal = true;
      this.modalMessage = 'Please fill all the mandatory details!';
      return this.modalRef = this.modalService.show(this.templateRef);
    }

    var obj: any = this.savePolicies.getPolicy();
    obj.userId = localStorage.getItem('userId');

    if (obj.type == "I" || obj.type == "|") {
      if (obj.policyMembersDetails) {
        let member = obj.policyMembersDetails;
        obj.policyMembersDetails = member[0] ? member[0].member_id : [];
      }
    } else {
      if (!obj.hasOwnProperty('policyDependentDetails')) {
        if (obj.policyMembersDetails) {
          var arr = [];
          obj.policyMembersDetails[0].member_id.map(ele => {
            var innerObj = {};
            innerObj['member_id'] = ele;
            arr.push(innerObj)
          })
          obj.policyDependentDetails = arr;
        }
      }

      delete obj.policyMembersDetails;
      delete obj.election;
    }
    delete obj.policyMembers;

    if (localStorage.getItem('PoliciesDetails')) {

      obj.policy_id = JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails[0].policy_id;

      this.api.updatePolicy(obj).subscribe((data: any) => {
        const Obj = {
          userId: localStorage.getItem('userId'),
          policy_id: JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails[0].policy_id
        }
        this.api.getPolicyDetails(Obj).subscribe((getdata: any) => {
          if (getdata.responseCode === 200) {
            this.spinner.hide();
            this.updateEditStatus(1);
            localStorage.setItem('PoliciesDetails', JSON.stringify(getdata.result));
          }
          if (data.responseCode === 200) {
            this.spinner.hide();
            this.policyForm.disable();
            this.savePolicies.clearPolicy();
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
      this.spinner.show();
      this.api.createPolicy(obj).subscribe((data: any) => {
        this.spinner.hide();
        if (data.responseCode === 200) {
          this.policyForm.disable();
          this.savePolicies.clearPolicy();
          this.disable = true;
          this.errorModal = false;
          this.modalMessage = data.message;
          return this.modalRef = this.modalService.show(this.templateRef);
        } else {
          this.modalMessage = data.error;
          this.errorModal = true;
          return this.modalRef = this.modalService.show(this.templateRef);
        }
      });
    }
  }

  submit() {
    console.log(this.savePolicies.addToPolicy(this.policyForm.value));
    this.validate();
  }

  tabClick(event) {
    console.log(this.savePolicies.addToPolicy(this.policyForm.value));
    const policyData = this.savePolicies.getPolicy();

    if (event.index == 2) {
      if (policyData['policyMembersDetails']) {
        this.selectedMembers = policyData['policyMembersDetails'][0]['member_id'];
      }
    }

    if (policyData['type'] == 'I' || policyData['type'] == '|' && policyData['primary_id']) {
      const Obj = {
        userId: localStorage.getItem('userId'),
        clientId: policyData['primary_id']
      }
      this.api.getClientRelationships(Obj).subscribe((data: any) => {
        this.spinner.hide();
        if (data.responseCode === 200) {
          console.log(this.savePolicies.addToPolicy({ "policyMembers": data.result }));
        }
      });
    } else {
      const Obj = {
        userId: localStorage.getItem('userId'),
        group_id: policyData['primary_id']
      }
      this.api.getGroupAllDetails(Obj).subscribe((data: any) => {
        this.spinner.hide();
        if (data.responseCode === 200) {
          console.log(this.savePolicies.addToPolicy({ "policyMembers": data.result.groupMembersDetails }));
        }
      });
    }
    if (policyData['type'] == 'G' && policyData['primary_id']) {

    }
  }

  updateDetails() {
    this.activatedRoute.params.subscribe(params => {
      this.spinner.hide();
      if (params.edit == 0) {
        this.modalService.hide(1);
        this.savePolicies.clearPolicy();
        window.location.reload();
      } else {
        const Obj = {
          userId: localStorage.getItem('userId'),
          policy_id: JSON.parse(localStorage.getItem('PoliciesDetails')).policyDetails[0].policy_id
        }
        this.api.getPolicyDetails(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            this.spinner.hide();
            localStorage.setItem('PoliciesDetails', JSON.stringify(data.result));
            this.savePolicies.clearPolicy();
            window.location.reload();
          }
        });
      }
    });
  }

}
