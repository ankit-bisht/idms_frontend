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

@Component({
  selector: 'app-relationships',
  templateUrl: './relationships.component.html',
  styleUrls: ['./relationships.component.scss']
})
export class RelationshipsComponent implements OnChanges {

  documentForm: FormGroup;
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
  @ViewChild(MatPaginator, {static: false}) set paginator(value: MatPaginator) {
    if(this.dataSource) {
      this.dataSource.paginator = value;
    }
}  displayedColumns = ['first_name', 'last_name', 'DOB'];
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;
  dataSource: any;
  idVal = "";
  length: any = 0;

  constructor(private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) { }

  @Input() disable: boolean;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.documentForm = this.fb.group({
      clientRelationShipDetails: this.fb.array([])
    });
    if (localStorage.getItem('ClientDetails')) {
      if (JSON.parse(localStorage.getItem('ClientDetails')).clientRelationShipDetails.length >= 1) {
        this.setDetails();
      }
    }
    if (disable.disable.currentValue) {
      this.documentForm.disable();
    } else {
      this.documentForm.enable();
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
    this.control = this.documentForm.get('clientRelationShipDetails') as FormArray;
  }

  setDetails() {
    const control = this.documentForm.get('clientRelationShipDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('ClientDetails')).clientRelationShipDetails;
    Details.map(element => {
      control.push(this.setForm(element));
    });
    this.documentForm.value.clientRelationShipDetails.map((element, key) => {
      delete element.isEditable;
    });
    this.saveIndividuals.addToIndividual(this.documentForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      id2: [element.id2, Validators.required],
      relationshipId: [element.relationshipId, Validators.required],
      isEditable: [false]
    });
  }


  getConstants() {
    let constantArr = JSON.parse(localStorage.getItem('constants')).relationShips;
    let keysArr = Object.keys(JSON.parse(localStorage.getItem('constants')).relationShips);
    this.relationshipType = keysArr.reduce((acc, key) => {
      acc.push({
        relationship: constantArr[key],
        id: key
      })
      return acc;
    }, []);
    this.clients = JSON.parse(localStorage.getItem('clients'));
    if (localStorage.getItem('ClientDetails')) {
      this.clientDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientDetails[0];
      const Details = JSON.parse(localStorage.getItem('ClientDetails')).clientRelationShipDetails;
      this.filterIndividualsArray(Details.map(d => d.id2));
      this.filterIndividualsArray(this.clientDetails.client_id);
    } else {
      this.filterIndividualsArray(0);
    }
  }


  initiateForm(): FormGroup {
    return this.fb.group({
      id2: [''],
      relationshipId: [''],
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
    const control = this.documentForm.get('clientRelationShipDetails') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.documentForm.get('clientRelationShipDetails') as FormArray;
    control.removeAt(index);
    this.submitForm();
  }

  setValue(group: FormGroup, client_id) {
    group.get('id2').setValue(client_id);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
    this.filterIndividualsArray(group.get('id2').value);
  }

  get getFormControls() {
    const control = this.documentForm.get('clientRelationShipDetails') as FormArray;
    return control;
  }


  closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }
  submitForm() {

    this.closeAllModals();
    const control = this.documentForm.get('clientRelationShipDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    if (!this.documentForm.valid) {
      // setTimeout(() => {
      //   this.modalMessage = "Please Fill All Details Correctly!!"
      //   return this.modalRef = this.modalService.show(this.templateRef);
      // }, 5000);

    } else {
      var documentDetails = this.documentForm.value.clientRelationShipDetails;
      documentDetails.map((element, key) => {
        delete element.isEditable;
      });
    }
    console.log(this.saveIndividuals.addToIndividual(this.documentForm.value));
  }
  getIndividual(val) {
    let client = this.clients.find(r => r.client_id == val);
    return !!client ? `${client.first_name} ${client.last_name}` : '';
  }
  getRelationship(val) {
    let relation = this.relationshipType.find(r => r.id == val);
    return !!relation ? `${relation.relationship}` : '';
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
