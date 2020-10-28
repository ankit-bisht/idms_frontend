import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges } from "@angular/core";
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
import { NgxSpinnerService } from 'ngx-spinner';
import { element } from 'protractor';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnChanges {

  attachmentForm: FormGroup;
  control: FormArray;
  mode: boolean;
  docType: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  fileArray: any = [];
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) { }

  @Input() disable: boolean;

  ngOnChanges(disable: SimpleChanges): void {
    this.getConstants();
    this.touchedRows = [];
    this.attachmentForm = this.fb.group({
      clientAttachmentDetails: this.fb.array([])
    });
    if (localStorage.getItem('ClientDetails')) {
      if (JSON.parse(localStorage.getItem('ClientDetails')).clientAttachmentDetails.length >= 1) {
        this.setDetails();
      }
    }
    if (disable.disable.currentValue) {
      this.attachmentForm.disable();
    } else {
      this.attachmentForm.enable();
      // this.addRow();
    }
  }

  ngAfterOnInit() {
    this.control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      attachment_type: [''],
      attachment_location: [''],
      attachment_description: [''],
      isEditable: [true]
    });
  }

  setDetails() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('ClientDetails')).clientAttachmentDetails;
    Details.map(element => {
      delete element.attachment_id;
      control.push(this.setForm(element));
    });
    this.attachmentForm.value.clientAttachmentDetails.map((element, key) => {
      delete element.isEditable;
      const id = key + 1;
      element.attachment_id = id.toString();
    });
    this.saveIndividuals.addToIndividual(this.attachmentForm.value);

  }

  setForm(element): FormGroup {
    return this.fb.group({
      attachment_link: ["http://67.200.244.131:81/documents/" + element.attachment_location],
      attachment_type: [element.attachment_type, Validators.required],
      attachment_location: [element.attachment_location, Validators.required],
      attachment_description: [element.attachment_description],
      isEditable: [false]
    });
  }

  getConstants() {
    this.docType = JSON.parse(localStorage.getItem('docType'));
  }

  addRow() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    control.removeAt(index);
    this.submitForm();
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  get getFormControls() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    return control;
  }


  uploadFile(file, index) {
    const File = file[0];
    const formData = new FormData();
    formData.append('file', File, File.name);
    formData.append('userId', localStorage.getItem('userId'));
    this.spinner.show();

    this.api.uploadAttachment(formData).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        const form = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
        form.controls[index].patchValue({
          attachment_type: File.type,
        });

        this.modalMessage = data.message;
        return this.modalRef = this.modalService.show(this.templateRef);
      } else {
        this.spinner.hide();
        this.modalMessage = data.error;
        return this.modalRef = this.modalService.show(this.templateRef);
      }
    });
    this.submitForm();
  }

  openModal(): any {
    this.spinner.show();
  }

  submitForm() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    var contactsDetails = this.attachmentForm.value.clientAttachmentDetails;
    contactsDetails.forEach((element, key) => {
      delete element.isEditable;
      const id = key + 1;
      element.attachment_description = element.attachment_description.toString();
      element.attachment_id = id.toString();
      element.attachment_type = element.attachment_location._fileNames ? element.attachment_location._fileNames.slice(element.attachment_location._fileNames.lastIndexOf('.') + 1) : element.attachment_location.slice(element.attachment_location.lastIndexOf('.') + 1);
      element.attachment_location = element.attachment_location._fileNames ? element.attachment_location._fileNames : element.attachment_location;

    });
    console.log(this.saveIndividuals.addToIndividual(this.attachmentForm.value));
  }

}
