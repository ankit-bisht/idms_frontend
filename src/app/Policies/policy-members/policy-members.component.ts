
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
  selector: 'app-policy-members',
  templateUrl: './policy-members.component.html',
  styleUrls: ['./policy-members.component.scss']
})
export class PolicyMembersComponent implements OnChanges {

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
  touchedRows: any;
  document_status: any;
  relations = [];
  display = "none";
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

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.memberForm = this.fb.group({
      policyMembersDetails: this.fb.array([])
    });
    this.relations = this.savePolicy.getPolicy()['policyMembers'];
    if (localStorage.getItem('PoliciesDetails')) {
      if (JSON.parse(localStorage.getItem('PoliciesDetails')).policyMembersDetails.length >= 1) {
        this.setDetails();
      }
    }
    if (disable.disable.currentValue) {
      this.memberForm.disable();
    } else {
      this.memberForm.enable();
      // this.addRow();
    }
    this.dataSource = new MatTableDataSource(this.filteredClients);
    // this.dataSource.paginator = this.paginator;
    this.length = this.filteredClients.length;

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterOnInit() {
    this.control = this.memberForm.get('policyMembersDetails') as FormArray;
  }

  setDetails() {
    const control = this.memberForm.get('policyMembersDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('PoliciesDetails')).policyMembersDetails;
    Details.map(element => {
      control.push(this.setForm(element));
    });
    this.memberForm.value.policyMembersDetails.map((element, key) => {
      delete element.isEditable;
    });
    this.savePolicy.addToPolicy(this.memberForm.value);
  }

  setForm(element): FormGroup {
    console.log(element);

    return this.fb.group({
      member_id: [element.member_id, Validators.required],
      isEditable: [false]
    });
  }


  getConstants() {
    this.clients = JSON.parse(localStorage.getItem('clients'));
    if (localStorage.getItem('PoliciesDetails')) {
      this.clientDetails = JSON.parse(localStorage.getItem('PoliciesDetails')).policyMembersDetails[0];
      if (this.clientDetails) {
        const Details = JSON.parse(localStorage.getItem('PoliciesDetails')).policyMembersDetails;
        this.filterIndividualsArray(Details.map(d => d.member_id));
        this.filterIndividualsArray(this.clientDetails.member_id);
      }
      this.filterIndividualsArray(0);
    } else {
      this.filterIndividualsArray(0);
    }
  }


  initiateForm(): FormGroup {
    return this.fb.group({
      member_id: [''],
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
    const control = this.memberForm.get('policyMembersDetails') as FormArray;
    control.push(this.initiateForm());
    this.relations = this.savePolicy.getPolicy()['policyMembers'];
    this.submitForm();
  }

  deleteRow(index: number) {
    const control = this.memberForm.get('policyMembersDetails') as FormArray;
    control.removeAt(index);
    this.submitForm();
  }

  setValue(group: FormGroup, client_id) {
    group.get('member_id').setValue(client_id.value);
    this.submitForm();
  }

  setRelValue(group: FormGroup, relations) {
    this.submitForm();
  }

  editRow(group: FormGroup) {
    if (this.relations != this.savePolicy.getPolicy()['policyMembers']) {
      this.memberForm.reset();
    }
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
    this.submitForm();
    this.filterIndividualsArray(group.get('member_id').value);
  }

  get getFormControls() {
    const control = this.memberForm.get('policyMembersDetails') as FormArray;
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
    const control = this.memberForm.get('policyMembersDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    var documentDetails = this.memberForm.value.policyMembersDetails;
    documentDetails.map((element, key) => {
      delete element.isEditable;
    });
    console.log(this.savePolicy.addToPolicy(this.memberForm.value));
  }

  getIndividual(val) {
    let client = this.clients.find(r => r.client_id == val);
    return !!client ? `${client.first_name} ${client.last_name}` : '';
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
