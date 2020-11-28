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
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnChanges {

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

  constructor(private spinner: NgxSpinnerService, public Router: Router, private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveGroup: IndividualDetailServiceService) { }

  @Input() disable: boolean;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.memberForm = this.fb.group({
      groupMembersDetails: this.fb.array([])
    });
    if (localStorage.getItem('GroupDetails')) {
      if (JSON.parse(localStorage.getItem('GroupDetails')).groupMembersDetails.length >= 1) {
        this.setDetails();
        console.log("jii");

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
    this.control = this.memberForm.get('groupMembersDetails') as FormArray;
  }

  setDetails() {
    const control = this.memberForm.get('groupMembersDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('GroupDetails')).groupMembersDetails;
    Details.map(element => {
      control.push(this.setForm(element));
    });
    this.memberForm.value.groupMembersDetails.map((element, key) => {
      delete element.isEditable;
    });
    this.saveGroup.addToGroup(this.memberForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      client_id: [element.client_id, Validators.required],
      isEditable: [false]
    });
  }


  getConstants() {
    this.clients = JSON.parse(localStorage.getItem('clients'));
    if (localStorage.getItem('GroupDetails')) {
      this.clientDetails = JSON.parse(localStorage.getItem('GroupDetails')).groupMembersDetails[0];
      if (this.clientDetails) {
        const Details = JSON.parse(localStorage.getItem('GroupDetails')).groupMembersDetails;
        this.filterIndividualsArray(Details.map(d => d.client_id));
        this.filterIndividualsArray(this.clientDetails.client_id);
      }
      this.filterIndividualsArray(0);
    } else {
      this.filterIndividualsArray(0);
    }
  }


  initiateForm(): FormGroup {
    return this.fb.group({
      client_id: [''],
      // relationshipId: [''],
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
    const control = this.memberForm.get('groupMembersDetails') as FormArray;
    control.push(this.initiateForm());
    this.submitForm();
  }

  deleteRow(index: number) {
    const control = this.memberForm.get('groupMembersDetails') as FormArray;
    control.removeAt(index);
    this.submitForm();
  }

  setValue(group: FormGroup, client_id) {
    group.get('client_id').setValue(client_id);
    this.submitForm();
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
    this.submitForm();
    this.filterIndividualsArray(group.get('client_id').value);
  }

  get getFormControls() {
    const control = this.memberForm.get('groupMembersDetails') as FormArray;
    return control;
  }


  closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }

  goToIndividual(group) {

    this.spinner.show();
    const Obj = {
      userId: localStorage.getItem('userId'),
      clientId: group.value.client_id
    }
    this.api.getClientAllDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
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
    const control = this.memberForm.get('groupMembersDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    var documentDetails = this.memberForm.value.groupMembersDetails;
    documentDetails.map((element, key) => {
      delete element.isEditable;
    });
    console.log(this.saveGroup.addToGroup(this.memberForm.value));
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
  }
}
