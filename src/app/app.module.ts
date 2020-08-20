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
import { GroupsComponent } from './groups/groups.component';
import { IndividualsComponent } from './individuals/individuals.component';
import { PoliciesComponent } from './policies/policies.component';
import { AgentsComponent } from './agents/agents.component';
import { CarriersComponent } from './carriers/carriers.component';
import { ReportsComponent } from './reports/reports.component';
import { CommisionComponent } from './commision/commision.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NewIndividualComponent } from './new-individual/new-individual.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Constants } from './configuration/constants';
import { JwPaginationModule } from 'jw-angular-pagination';
import { MatTabsModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';


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
    NewIndividualComponent
  ],
  imports: [
    MatTabsModule,
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
    BsDatepickerModule.forRoot()
  ],
  providers: [LoginGuard, CommonService, ApiService, Configuration, Constants],
  bootstrap: [AppComponent]
})
export class AppModule { }
