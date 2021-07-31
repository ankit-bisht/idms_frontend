import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { IndividualDetailServiceService } from '../../individual-detail-service.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-new-carriers',
  templateUrl: './new-carriers.component.html',
  styleUrls: ['./new-carriers.component.scss']
})
export class NewCarriersComponent implements OnInit {

  // @ViewChild('mediumModalContent', { static: true }) modal: TemplateRef<any>;

  successMessage: string;
  success: boolean = false;
  groupForm: FormGroup;
  disable: boolean = false;
  errorModal: any;
  modalRef: BsModalRef;
  modalMessage: any;
  carrierName: any;
  website: any;
  commission:any;
  deleteClient: any;
  userEdit: Boolean = false;
  showCommission:Boolean=false;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;

  constructor(private activatedRoute: ActivatedRoute, private modalService: BsModalService, private saveCarrier: IndividualDetailServiceService, private spinner: NgxSpinnerService, private fb: FormBuilder, private api: ApiService, public Router: Router) {
  }
  ngOnInit() {
    this.saveCarrier.clearCarrier();
    this.setProduct();
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

  setProduct() {
    this.spinner.show();
    const Obj = {
      userId: localStorage.getItem('userId'),
    }
    this.api.getAllProductsDetails(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.spinner.hide();
        localStorage.setItem('products', JSON.stringify(data.result));
      }
    });
  }

  buildGroupForm(): void {

    this.groupForm = new FormGroup({
      "carrierName": new FormControl('', [Validators.required]),
      "website": new FormControl(''),
      // "commission": new FormControl('')
    });

    let getClientDetail = JSON.parse(localStorage.getItem('CarrierDetails'));

    if (getClientDetail) {
      this.showCommission = true;
      const Client = getClientDetail.carrierBaseDetails[0];
      this.groupForm.disable();
      this.disable = true;
      this.carrierName = Client.carrier_name;
      this.website = Client.website;
      this.commission = Client.commission;
    }
  }

  validate() {
    this.saveCarrier.addToCarrier(this.groupForm.value);

    if (this.groupForm.valid) {

      var obj: any = this.saveCarrier.getCarrier();
      obj.userId = localStorage.getItem('userId');

      if (localStorage.getItem('CarrierDetails')) {

        obj.carrier_id = JSON.parse(localStorage.getItem('CarrierDetails')).carrierBaseDetails[0].carrier_id

        this.api.updateCarrier(obj).subscribe((data: any) => {
          this.spinner.show();
          const Obj = {
            userId: localStorage.getItem('userId'),
            carrier_id: JSON.parse(localStorage.getItem('CarrierDetails')).carrierBaseDetails[0].carrier_id
          }
          this.api.getCarrierAllDetails(Obj).subscribe((getdata: any) => {
            if (getdata.responseCode === 200) {
              this.spinner.hide();
              localStorage.setItem('CarrierDetails', JSON.stringify(getdata.result));
            }
            if (data.responseCode === 200) {
              this.spinner.hide();
              this.groupForm.disable();
              this.saveCarrier.clearCarrier();
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

        this.api.createCarrier(obj).subscribe((data: any) => {
          this.spinner.show();
          if (data.responseCode === 200) {
            this.spinner.hide();
            this.groupForm.disable();
            this.saveCarrier.clearCarrier();
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
    console.log(this.saveCarrier.addToCarrier(this.groupForm.value));
  }

  redirect() {
    if (this.userEdit == true) {
      this.updateEditStatus(1);
    }
    this.Router.navigate(['/carriers']);
  }

  updateEditStatus(status) {
    if (localStorage.getItem('CarrierDetails')) {
      const obj = {
        carrier_id: JSON.parse(localStorage.getItem('CarrierDetails')).carrierBaseDetails[0].carrier_id,
        userId: localStorage.getItem('userId'),
        status: status
      }
      this.api.updateCarrierEditStatus(obj).subscribe((data: any) => {
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
      carrier_id: JSON.parse(localStorage.getItem('CarrierDetails')).carrierBaseDetails[0].carrier_id
    }
    this.api.getCarrierAllDetails(Obj).subscribe((getdata: any) => {
      if (getdata.responseCode === 200) {
        if (getdata.result.carrierBaseDetails[0].edit == 2) {
          this.errorModal = true;
          this.modalMessage = "This Carrier is currently being updated by some other user.";
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
    this.modalMessage = 'Are you sure you want to delete this Carrier?';
    return this.modalRef = this.modalService.show(this.templateRef);
  }

  delete() {
    this.modalService.hide(1);
    const obj = {
      carrier_id: JSON.parse(localStorage.getItem('CarrierDetails')).carrierBaseDetails[0].carrier_id,
      userId: localStorage.getItem('userId')
    }
    this.api.deleteCarrier(obj).subscribe((data: any) => {
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
        this.saveCarrier.clearCarrier();
        window.location.reload();
      } else {
        const Obj = {
          userId: localStorage.getItem('userId'),
          carrier_id: JSON.parse(localStorage.getItem('CarrierDetails')).carrierBaseDetails[0].carrier_id
        }
        this.api.getCarrierAllDetails(Obj).subscribe((data: any) => {
          if (data.responseCode === 200) {
            this.spinner.hide();
            localStorage.setItem('CarrierDetails', JSON.stringify(data.result));
            window.location.reload();
          }
        });
      }
    });
  }
}
