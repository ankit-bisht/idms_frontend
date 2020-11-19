import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guards/login.guard';
import { CommonService } from './services/common.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { ContentAnimateDirective } from '../shared/directives/content-animate.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { Configuration } from './configuration/config';
import { GroupsComponent } from './Groups/groups/groups.component';
import { IndividualsComponent } from './Individuals/individuals/individuals.component';
import { PoliciesComponent } from './policies/policies.component';
import { AgentsComponent } from './agents/agents.component';
import { CarriersComponent } from './carriers/carriers.component';
import { ReportsComponent } from './reports/reports.component';
import { CommisionComponent } from './commision/commision.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NewIndividualComponent } from './Individuals/new-individual/new-individual.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Constants } from './configuration/constants';
import { JwPaginationModule } from 'jw-angular-pagination';
import { MatTabsModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { ContactsComponent } from './Individuals/contacts/contacts.component';
import { NgxBootstrapModalComponent } from './ngx-bootstrap-modal/ngx-bootstrap-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddressComponent } from './Individuals/address/address.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PhoneMaskDirective } from './phone-mask.directive';
import { SSNMaskDirective } from './ssn-mask.directive';
import { EmploymentComponent } from './Individuals/employment/employment.component';
import { PaymentComponent } from './Individuals/payment/payment.component';
import { AttachmentsComponent } from './Individuals/attachments/attachments.component';
import { DocumentsComponent } from './Individuals/documents/documents.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { RelationshipsComponent } from './Individuals/relationships/relationships.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NewGroupsComponent } from './Groups/new-groups/new-groups.component';


export const DateFormat = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'MM/DD/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    SpinnerComponent,
    ContentAnimateDirective,
    GroupsComponent,
    IndividualsComponent,
    PoliciesComponent,
    AgentsComponent,
    CarriersComponent,
    ReportsComponent,
    CommisionComponent,
    NewIndividualComponent,
    ContactsComponent,
    NgxBootstrapModalComponent,
    AddressComponent,
    PhoneMaskDirective,
    SSNMaskDirective,
    EmploymentComponent,
    PaymentComponent,
    AttachmentsComponent,
    DocumentsComponent,
    RelationshipsComponent,
    NewGroupsComponent,
  ],
  imports: [
    ModalModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MaterialFileInputModule,
    NgxSpinnerModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    JwPaginationModule,
    FileUploadModule,
    BsDatepickerModule.forRoot(),
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule
  ],
  exports: [
    PhoneMaskDirective, SSNMaskDirective, MatMomentDateModule
  ],
  providers: [LoginGuard, CommonService, ApiService, Configuration, Constants, { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
