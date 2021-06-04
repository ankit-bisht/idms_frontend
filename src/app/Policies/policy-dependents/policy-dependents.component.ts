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
          this.setMembers('create');
        }
      }
    }

    if (localStorage.getItem('PoliciesDetails')) {
      if (JSON.parse(localStorage.getItem('PoliciesDetails')).policyDependentDetails.length >= 1) {
        this.setDetails();
      } else {
        this.setMembers('edit');
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

  setMembers(type) {
    let policyMembers = this.savePolicy.getPolicy()['policyMembersDetails'][0];
    const control = this.memberForm.get('policyDependentDetails') as FormArray;
    let policyMember = policyMembers.member_id.filter((v, i, a) => a.findIndex(t => (t === v)) === i)

    if (type != "create") {
      const Details = JSON.parse(localStorage.getItem('PoliciesDetails')).policyDependentDetails;
      if (Details.length > 0) {
        Details.map(ele => {
          if (policyMember.includes(ele.member_id)) {
            policyMember.splice(policyMember.indexOf(ele.member_id), 1);
          }
        })
      }

      for (const element of policyMember) {
        control.push(this.setMembersForm(element));
      }
    } else {
      for (const element of policyMember) {
        control.push(this.setMembersForm(element));
      }
    }

  }

  setDetails() {
    const control = this.memberForm.get('policyDependentDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('PoliciesDetails')).policyDependentDetails;

    Details.map((members, key) => {
      let array = [];
      // members.dependent = members.dependent.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id || t.DOB === v.DOB)) === i)
      control.push(this.setForm(members));
      for (const iterator of members.dependent) {
        let client = this.clients.find(r => r.client_id == iterator);
        array.push(client);
        array = array.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id || t.DOB === v.DOB)) === i)
        this.arrayRelations[key] = array;
      }

      const Obj = {
        clientId: members.member_id,
        tier: members.tier
      }
      this.api.getClientTierRelationships(Obj).subscribe((data: any) => {
        if (data.responseCode === 200) {
          this.dependants[key] = data.result;
        }
      });
    });
    this.setMembers('edit');

    this.memberForm.value.policyDependentDetails.map((element, key) => {
      delete element.isEditable;
    });
    this.savePolicy.addToPolicy(this.memberForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      member_id: [element.member_id, Validators.required],
      tier: [element.tier, Validators.required],
      dependent: [element.dependent, Validators.required],
      isEditable: [false]
    });
  }

  setMembersForm(element): FormGroup {
    return this.fb.group({
      member_id: [element, Validators.required],
      tier: ['1', Validators.required],
      dependent: [[]],
      isEditable: [false]
    });
  }

  getConstants() {
    this.clients = JSON.parse(localStorage.getItem('clients'));
    this.election = JSON.parse(localStorage.getItem('policy_constants'))['election'];
  }


  initiateForm(): FormGroup {
    return this.fb.group({
      member_id: [''],
      tier: [''],
      dependent: [[]],
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

  setDependants(group: FormGroup, tier, i) {
    group.get('tier').setValue(tier);
    const Obj = {
      clientId: group.get('member_id').value,
      tier: tier
    }
    this.api.getClientTierRelationships(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.dependants[i] = data.result;
      }
    });
  }

  setDependantsValue(group: FormGroup, client_id, i) {
    group.get('dependent').setValue(client_id);
    this.submitForm();
    let array = [];
    for (const iterator of group.get('dependent').value) {
      let client = this.clients.find(r => r.client_id == iterator);
      array.push(client);
    }
    this.arrayRelations[i] = array;
    // this.arrayRelations = this.arrayRelations.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id || t.DOB === v.DOB)) === i)
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
    // this.arrayRelations = [];
    this.submitForm();
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
    let client = this.clients.find(r => r.client_id == val);
    return !!client ? `${client.first_name} ${client.last_name}` : '';
  }

  getDependents(val) {
    // for (const iterator of val) {
    //   let client = this.clients.find(r => r.client_id == iterator);
    //   this.arrayRelations.push(client);
    // }
    // this.arrayRelations = this.arrayRelations.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id || t.DOB === v.DOB)) === i)
  }

  getTire(val) {
    return val ? this.election[val] : this.election[1];
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
