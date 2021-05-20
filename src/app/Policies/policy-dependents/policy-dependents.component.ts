import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges, AfterViewInit } from "@angular/core";
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
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy-dependents',
  templateUrl: './policy-dependents.component.html',
  styleUrls: ['./policy-dependents.component.scss']
})
export class PolicyDependentsComponent implements OnChanges {

  memberForm: FormGroup;
  control: FormArray;
  mode: boolean;
  relationshipType: any;
  clients: any;
  filteredClients: any;
  filterArr = [];
  clientDetails: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any = [];
  disableButton = true;
  document_status: any;
  relations = [];
  arrayRelations = [];
  election = [];
  dependants = [];
  display = "none";
  client: any = [];
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  displayedColumns = ['first_name', 'last_name', 'DOB'];
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;
  dataSource: any;
  idVal = "";
  length: any = 0;

  constructor(public Router: Router, private spinner: NgxSpinnerService, private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private savePolicy: IndividualDetailServiceService) { }

  @Input() disable: boolean;
  @Input() members: any;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.memberForm = this.fb.group({
      policyDependentDetails: this.fb.array([])
    });

    if (disable['disable'] && disable['disable'].previousValue != disable['disable'].currentValue) {
      if (disable.disable.currentValue) {
        this.memberForm.disable();
      } else {
        this.memberForm.enable();
      }
    }
    if (disable['members'] && disable['members'].previousValue != disable['members'].currentValue) {
      let policyMembers = this.savePolicy.getPolicy()['policyMembersDetails']
      if (policyMembers) {
        if (!localStorage.getItem('PoliciesDetails')) {
          this.setMembers();
        }
      }
    }

    if (localStorage.getItem('PoliciesDetails')) {
      if (JSON.parse(localStorage.getItem('PoliciesDetails')).policydependentDetails.length >= 1) {
        this.setDetails();
      }
    }

    // this.dataSource = new MatTableDataSource(this.filteredClients);
    // // this.dataSource.paginator = this.paginator;
    // this.length = this.filteredClients.length;
    this.client = localStorage.getItem('clients');
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterOnInit() {
    this.control = this.memberForm.get('policyDependentDetails') as FormArray;
  }

  setMembers() {
    let policyMembers = this.savePolicy.getPolicy()['policyMembersDetails'][0];
    const control = this.memberForm.get('policyDependentDetails') as FormArray;
    for (const element of policyMembers.member_id) {
      control.push(this.setMembersForm(element));
    }
    // control.push(this.setMembersForm(iterator));

    // Details.map(members => {
    // control.push(this.setForm(members));
    // });
  }

  setDetails() {
    let members = [];
    const control = this.memberForm.get('policyDependentDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('PoliciesDetails')).policydependentDetails;
    // this.arrayRelations = Details;

    // const map = new Map(Details.map(({ member_id, dependent_id, tier }) => [member_id, { member_id, dependent_id: [], tier }]));
    // for (let { member_id, dependent_id, tier } of Details) map.get(member_id).dependent_id.push(...[dependent_id].flat());

    // const localStorageValue = [...map.values()];

    // localStorageValue.map(members => {
    //   control.push(this.setForm(members));
    // });
    this.memberForm.value.policyDependentDetails.map((element, key) => {
      delete element.isEditable;
    });
    this.savePolicy.addToPolicy(this.memberForm.value);
  }

  setForm(element): FormGroup {
    console.log(element);

    return this.fb.group({
      member_id: [element.member_id, Validators.required],
      tier: [element.tier, Validators.required],
      dependent: [element.dependent_id, Validators.required],
      isEditable: [false]
    });
  }

  setMembersForm(element): FormGroup {
    return this.fb.group({
      member_id: [element, Validators.required],
      tier: ['', Validators.required],
      dependent: [''],
      isEditable: [false]
    });
  }

  getConstants() {
    this.clients = JSON.parse(localStorage.getItem('clients'));
    this.election = JSON.parse(localStorage.getItem('policy_constants'))['election'];
    if (localStorage.getItem('PoliciesDetails')) {
      // this.clientDetails = JSON.parse(localStorage.getItem('PoliciesDetails')).policydependentDetails;
      // if (this.clientDetails) {
      //   const Details = JSON.parse(localStorage.getItem('PoliciesDetails')).policydependentDetails;
      //   this.filterIndividualsArray(Details.map(d => d.member_id));
      //   this.filterIndividualsArray(this.clientDetails.member_id);
      // }
      // this.filterIndividualsArray(0);
    } else {
      this.filterIndividualsArray(0);
    }
  }


  initiateForm(): FormGroup {
    return this.fb.group({
      member_id: [''],
      tier: [''],
      dependent: [''],
      isEditable: [true]
    });
  }

  openModal() {
    this.display = "block";
  }

  onCloseHandled() {
    this.display = "none";
  }

  addRow() {
    const control = this.memberForm.get('policyDependentDetails') as FormArray;
    control.push(this.initiateForm());
    this.relations = this.savePolicy.getPolicy()['policyMembers'];
    this.disableButton = false;
    this.submitForm();
  }

  deleteRow(index: number) {
    const control = this.memberForm.get('policyDependentDetails') as FormArray;
    control.removeAt(index);
    this.disableButton = true;
    this.submitForm();
  }

  setValue(group: FormGroup, client_id) {
    group.get('member_id').setValue(client_id);
    this.submitForm();
  }

  setDependants(group: FormGroup, tier) {
    group.get('tier').setValue(tier);
    const Obj = {
      clientId: group.get('member_id').value,
      tier: tier
    }
    this.api.getClientTierRelationships(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.dependants = data.result;
      }
    });
  }

  setDependantsValue(group: FormGroup, client_id) {
    group.get('dependent').setValue(client_id);
    this.submitForm();
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
    this.arrayRelations = [];
    this.submitForm();
    this.arrayRelations = [];
    for (const iterator of group.get('dependent').value) {
      let client = this.clients.find(r => r.client_id == iterator);
      this.arrayRelations.push(client);
    }
    this.arrayRelations = this.arrayRelations.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id || t.DOB === v.DOB)) === i)
  }

  get getFormControls() {
    const control = this.memberForm.get('policyDependentDetails') as FormArray;
    return control;
  }


  closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }

  goToIndividual(group) {
    const Obj = {
      userId: localStorage.getItem('userId'),
      clientId: group.value.client_id
    }
    this.api.getClientAllDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        localStorage.setItem('ClientDetails', JSON.stringify(data.result));
        if (data.result.clientDetails[0].edit == 2) {
          var edit = 1
        } else {
          edit = 2
        }
        this.Router.navigate(['individuals/newIndividual', { edit: data.result.clientDetails[0].edit }]);
      }
    });
  }

  submitForm() {
    this.closeAllModals();
    const control = this.memberForm.get('policyDependentDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    var documentDetails = this.memberForm.value.policyDependentDetails;
    documentDetails.map((element, key) => {
      delete element.isEditable;
    });
    console.log(this.savePolicy.addToPolicy(this.memberForm.value));
  }

  getIndividual(val) {
    // for (const iterator of val) {
    let client = this.clients.find(r => r.client_id == val);
    //   this.arrayRelations.push(client);
    // }
    // this.arrayRelations = this.arrayRelations.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id || t.DOB === v.DOB)) === i)
    return !!client ? `${client.first_name} ${client.last_name}` : '';
  }

  getDependents(val) {
    for (const iterator of val) {
      let client = this.clients.find(r => r.client_id == iterator);
      this.arrayRelations.push(client);
    }
    this.arrayRelations = this.arrayRelations.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id || t.DOB === v.DOB)) === i)
  }

  getTire(val) {
    return this.election[val];
  }

  filterIndividualsArray(id) {
    if (Array.isArray(id)) {
      this.filterArr.concat(id);
    } else {
      this.filterArr.push(id);
    }
    this.filteredClients = this.clients.filter(c => this.filterArr.indexOf(c.client_id) == -1);
    this.filterArr = [...new Set(this.filterArr)];
    this.dataSource = new MatTableDataSource(this.filteredClients);
    this.length = this.filteredClients.length;
  }
}
