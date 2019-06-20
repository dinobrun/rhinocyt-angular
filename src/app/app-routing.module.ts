import { NgModule, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientComponent} from './patient/patient.component';
import { NewPatientComponent} from './new-patient/new-patient.component';
import { AddcellsComponent} from './addcells/addcells.component';
import { AnamnesisComponent} from './anamnesis/anamnesis.component';
import { DiagnosisComponent} from './diagnosis/diagnosis.component';
import { AddAnamnesisComponent} from './add-anamnesis/add-anamnesis.component';
import { ReviewComponent } from './review/review.component';
import { ReportPdfComponent} from './report-pdf/report-pdf.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { StartupComponent } from './startup/startup.component';
import { AboutComponent } from './about/about.component';
import { TitleService } from './shared/services/title.service';
import { DemoComponent } from './demo/demo.component';


const routes: Routes = [
  {
    path: '',
    component: StartupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Signup' }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: { title: 'Logout' }
  },
  {
    path: 'demo',
    component: DemoComponent,
    data: { title: 'Demo' }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' }
  },
  {
    path: 'dashboard/patient/new',
    component: NewPatientComponent,
    data: {title: 'New Patient'},
  },
  {
    path: 'dashboard/patient/:id',
    component: PatientComponent,
    data: { title: 'Patient' }
  },
  {
    path: 'dashboard/patient/:id/addcells',
    component: AddcellsComponent,
    data: { title: 'Add cells' }
  },
  {
    path: 'dashboard/review/:id',
    component: ReviewComponent,
    data: { title: 'Review' }
  },
  {
    path: 'dashboard/patient/:id/anamnesis',
    component: AnamnesisComponent,
    data: { title: 'Anamnesis' }
  },
  {
    path: 'dashboard/patient/:id/add-anamnesis',
    component: AddAnamnesisComponent,
    data: { title: 'Add anamnesis' }
  },
  {
    path: 'dashboard/patient/:id/diagnosis',
    component: DiagnosisComponent,
    data: { title: 'Diagnosis' }
  },
  {
    path: 'dashboard/patient/:id/report-pdf',
    component: ReportPdfComponent,
    data: { title: 'PDF report' }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'About' }
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private titleService: TitleService) {
    this.titleService.setDefaultTitle();
    this.titleService.setTitleOnRouteChanged();
  }
}
