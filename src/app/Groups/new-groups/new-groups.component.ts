import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { IndividualDetailServiceService } from '../../individual-detail-service.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-new-groups',
  templateUrl: './new-groups.component.html',
  styleUrls: ['./new-groups.component.scss']
})
export class NewGroupsComponent implements OnInit {

  // @ViewChild('mediumModalContent', { static: true }) modal: TemplateRef<any>;

  successMessage: string;
  success: boolean = false;
  groupForm: FormGroup;
  disable: boolean = false;
  errorModal: any;
  modalRef: BsModalRef;
  modalMessage: any;
  group_name: any;
  SIC: any;
  FEIN: any;
  deleteClient:any;
  userEdit: Boolean = false;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;

  constructor(private activatedRoute: ActivatedRoute, private modalService: BsModalService, private saveGroup: IndividualDetailServiceService, private spinner: NgxSpinnerService, private fb: FormBuilder, private api: ApiService, public Router: Router) {
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.edit == 1 || params.edit == null) {
        this.userEdit = true
      }
      if (params.edit == 2) {
        this.userEdit = false
      }
    });
    this.buildGroupForm();
  }

  buildGroupForm(): void {

    this.groupForm = new FormGroup({
      "group_name": new FormControl('', [Validators.required]),
      "FEIN": new FormControl('', [Validators.required]),
      "SIC": new FormControl('', [Validators.required]),
    });

    let getClientDetail = JSON.parse(localStorage.getItem('GroupDetails'));

    if (getClientDetail) {
      const Client = getClientDetail.groupDetails[0];

      this.groupForm.disable();
      this.disable = true;
      this.group_name = Client.group_name;
      this.FEIN = Client.FEIN;
      this.SIC = Client.SIC;

    }

    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getIndividuals(Obj).subscribe((data: any) => {
    });
  }

  validate() {
    this.saveGroup.addToGroup(this.groupForm.value);

    if (this.groupForm.valid) {

      var obj: any = this.saveGroup.getGroup();
      obj.userId = localStorage.getItem('userId');

      if (localStorage.getItem('GroupDetails')) {

        obj.group_id = JSON.parse(localStorage.getItem('GroupDetails')).groupDetails[0].group_id

        this.api.updateGroup(obj).subscribe((data: any) => {
          this.spinner.show();
          const Obj = {
            userId: localStorage.getItem('userId'),
            group_id: JSON.parse(localStorage.getItem('GroupDetails')).groupDetails[0].group_id
          }
          this.api.getGroupAllDetails(Obj).subscribe((getdata: any) => {
            if (getdata.responseCode === 200) {
              this.spinner.hide();
              // this.updateEditStatus(1);
              localStorage.setItem('GroupDetails', JSON.stringify(getdata.result));
            }
            if (data.responseCode === 200) {
              this.spinner.hide();
              this.groupForm.disable();
              this.saveGroup.clearGroup();
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

        this.api.createGroup(obj).subscribe((data: any) => {
          this.spinner.show();
          if (data.responseCode === 200) {
            this.spinner.hide();
            this.groupForm.disable();
            this.saveGroup.clearGroup();
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

  }

  onSubmit() {
    this.groupForm.value.userId = localStorage.getItem('userId');
    console.log(this.saveGroup.addToGroup(this.groupForm.value));
  }

  redirect() {
    if (this.userEdit == true) {
      this.updateEditStatus(1);
    }
    this.Router.navigate(['/groups']);
  }

  updateEditStatus(status) {
    if (localStorage.getItem('GroupDetails')) {
      const obj = {
        group_id: JSON.parse(localStorage.getItem('GroupDetails')).groupDetails[0].group_id,
        userId: localStorage.getItem('userId'),
        status: status
      }
      this.api.updateGroupEditStatus(obj).subscribe((data: any) => {
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

  enable() {
    this.checkUpdate();
  }

  checkUpdate() {
    const Obj = {
      userId: localStorage.getItem('userId'),
      group_id: JSON.parse(localStorage.getItem('GroupDetails')).groupDetails[0].group_id
    }
    this.api.getGroupAllDetails(Obj).subscribe((getdata: any) => {
      if (getdata.responseCode === 200) {
        if (getdata.result.groupDetails[0].edit == 2) {
          this.errorModal = true;
          this.modalMessage = "This individual is currently being updated by some other user.";
          return this.modalRef = this.modalService.show(this.templateRef);
        } else {
          this.updateEditStatus(2);
          this.groupForm.enable();
          this.disable = false;
        }
      }
    });
  }

  openDelete() {
    this.deleteClient = true;
    this.modalMessage = 'Are you sure you want to delete this Individual?';
    return this.modalRef = this.modalService.show(this.templateRef);
  }

  delete() {
    this.modalService.hide(1);
    const obj = {
      group_id: JSON.parse(localStorage.getItem('GroupDetails')).groupDetails[0].group_id,
      userId: localStorage.getItem('userId')
    }
    this.api.deleteGroup(obj).subscribe((data: any) => {
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

  updateDetails() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(params => {
      this.spinner.hide();
      if (params.edit == 0) {
        this.modalService.hide(1);
        this.saveGroup.clearGroup();
        window.location.reload();
      } else {
        const Obj = {
          userId: localStorage.getItem('userId'),
          group_id: JSON.parse(localStorage.getItem('GroupDetails')).groupDetails[0].group_id
        }
        this.api.getGroupAllDetails(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            this.spinner.hide();
            localStorage.setItem('GroupDetails', JSON.stringify(data.result));
            // this.saveGroup.clearGroup();
            window.location.reload();
          }
        });
      }
    });
  }
}
