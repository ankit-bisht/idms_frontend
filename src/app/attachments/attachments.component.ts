import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
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

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {

  attachmentForm: FormGroup;
  control: FormArray;
  mode: boolean;
  docType: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  fileArray:any=[];
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) { }

  ngOnInit(): void {
    this.getConstants();
    this.touchedRows = [];
    this.attachmentForm = this.fb.group({
      clientAttachmentDetails: this.fb.array([])
    });
    this.addRow();
  }

  ngAfterOnInit() {
    this.control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      attachment_type: ['', Validators.required],
      attachment_location: ['', Validators.required],
      attachment_description: [''],
      isEditable: [true]
    });
  }

  getConstants() {
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.documentDropDownValues(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.docType = data.result;
      }
    });
  }

  addRow() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    control.removeAt(index);
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
    const File = <File>file[0];
    const formData = new FormData();
    formData.append('file', File, File.name);
    formData.append('userId', localStorage.getItem('userId'));

    this.api.uploadAttachment(formData).subscribe((data: any) => {
      this.openModal();
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.fileArray.push({index:index , name:File.name});
        // setTimeout(() =>{ this.spinner.hide() }, 3000);                
        // const location = this.attachmentForm.controls.clientAttachmentDetails['controls'][index].controls.attachment_location;
        // location.setValue(File.name);

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
    if (!this.attachmentForm.valid) {

      // setTimeout(() => {
      //   this.modalMessage = "Please Fill All Details Correctly!!"
      //   return this.modalRef = this.modalService.show(this.templateRef);
      // }, 5000);

    } else {
      var contactsDetails = this.attachmentForm.value.clientAttachmentDetails;
      contactsDetails.map((element, key) => {
        for (let index = 0; index < this.fileArray.length; index++) {
          console.log(this.fileArray[index].index);
          
            if(this.fileArray[index].index == key){
              element.attachment_location = this.fileArray.name;
            }
          
        }

        delete element.isEditable;
        const id = key + 1;
        element.attachment_description = element.attachment_description.toString();
        element.attachment_id = id.toString();
      });
      console.log(this.saveIndividuals.addToIndividual(this.attachmentForm.value));
    }
  }

}
