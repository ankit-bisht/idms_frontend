import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ngx-bootstrap-modal',
  templateUrl: './ngx-bootstrap-modal.component.html',
  styleUrls: ['./ngx-bootstrap-modal.component.scss']
})

export class NgxBootstrapModalComponent implements OnInit {

  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }
  ngOnInit() {
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
}
