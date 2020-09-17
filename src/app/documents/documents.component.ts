import { Component, OnInit, ViewChild, TemplateRef,Input, OnChanges, SimpleChanges } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { IndividualDetailServiceService } from '../individual-detail-service.service';
import { ApiService } from '../services/api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnChanges {

  documentForm: FormGroup;
  control: FormArray;
  mode: boolean;
  docType: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) {
  }

  @Input() disable: boolean;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.documentForm = this.fb.group({
      clientDocumentDetails: this.fb.array([])
    });
    if (localStorage.getItem('ClientDetails')) {
      if (JSON.parse(localStorage.getItem('ClientDetails')).clientDocumentDetails.length >= 1) {
        this.setDetails();
      } else {
        this.addRow();
      }
    } else {
      this.addRow();
    }
    if (disable.disable.currentValue) {
      this.documentForm.disable();
    } else {
      this.documentForm.enable();
    }
  }

  ngAfterOnInit() {
    this.control = this.documentForm.get('clientDocumentDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      document_type_id: ['', Validators.required],
      due_date: ['', Validators.required],
      date_submitted: ['', Validators.required],
      status: ['', Validators.required],
      isEditable: [true]
    });
  }

  setDetails() {
    const control = this.documentForm.get('clientDocumentDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('ClientDetails')).clientDocumentDetails;
    Details.map(element => {
      control.push(this.setForm(element));
    });;
    //this.deleteRow(0);
    this.saveIndividuals.addToIndividual(this.documentForm.value);
  }

  setForm(element): FormGroup {
    return this.fb.group({
      document_type_id: [element.document_type_id, Validators.required],
      due_date: [element.due_date, Validators.required],
      date_submitted: [element.date_submitted, Validators.required],
      status: [element.status, Validators.required],
      isEditable: [true]
    });
  }

  getConstants() {
    this.docType = JSON.parse(localStorage.getItem('docType'));
  }

  private closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }

  addRow() {
    const control = this.documentForm.get('clientDocumentDetails') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.documentForm.get('clientDocumentDetails') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  get getFormControls() {
    const control = this.documentForm.get('clientDocumentDetails') as FormArray;
    return control;
  }

  format = (input) => {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, '$2/$3/$1');
  };

  submitForm() {
    this.closeAllModals();
    const control = this.documentForm.get('clientDocumentDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    if (!this.documentForm.valid) {
      // setTimeout(() => {
      //   this.modalMessage = "Please Fill All Details Correctly!!"
      //   return this.modalRef = this.modalService.show(this.templateRef);
      // }, 5000);

    } else {
      var documentDetails = this.documentForm.value.clientDocumentDetails;
      documentDetails.map((element, key) => {
        delete element.isEditable;
        const id = key + 1;
        element.document_id = id.toString();
        if (element.due_date != '') {
          element.due_date = new Date(element.due_date).toISOString().split('T')[0];
          element.due_date = this.format(element.due_date);
        }
        if (element.date_submitted != "") {
          element.date_submitted = new Date(element.date_submitted).toISOString().split('T')[0];
          element.due_date = this.format(element.date_submitted);
        }
      });
      console.log(this.saveIndividuals.addToIndividual(this.documentForm.value));
    }
  }
}
