import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guards/login.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupsComponent } from './Groups/groups/groups.component';
import { IndividualsComponent } from './Individuals/individuals/individuals.component';
import { PoliciesComponent } from './policies/policies.component';
import { AgentsComponent } from './Agents/agents/agents.component';
import { NewAgentsComponent } from './Agents/new-agents/new-agents.component';
import { CarriersComponent } from './Carriers/carriers/carriers.component';
import { ReportsComponent } from './reports/reports.component';
import { NewIndividualComponent } from './Individuals/new-individual/new-individual.component';
import { NewGroupsComponent} from './Groups/new-groups/new-groups.component';
import { NewCarriersComponent } from './Carriers/new-carriers/new-carriers.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login', component: LoginComponent,
    children: [
      {
        path: '', component: LoginComponent
      },
    ]
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoginGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [LoginGuard] },
  { path: 'individuals', component: IndividualsComponent, canActivate: [LoginGuard] },
  { path: 'groups/newGroups', component: NewGroupsComponent, canActivate: [LoginGuard] },
  { path: 'individuals/newIndividual', component: NewIndividualComponent, canActivate: [LoginGuard] },
  { path: 'policies', component: PoliciesComponent, canActivate: [LoginGuard] },
  { path: 'agents', component: AgentsComponent, canActivate: [LoginGuard] },
  { path: 'agents/newAgents', component:NewAgentsComponent , canActivate: [LoginGuard] },
  { path: 'carriers/newCarriers', component:NewCarriersComponent , canActivate: [LoginGuard] },
  { path: 'carriers', component: CarriersComponent, canActivate: [LoginGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
