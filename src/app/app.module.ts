import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { InterceptorModule } from './interceptor.module';

import { StartupComponent } from './startup/startup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientComponent } from './patient/patient.component';
import { AddcellsComponent } from './addcells/addcells.component';
import { ReviewComponent } from './review/review.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { ContentComponent } from './shared/components/content/content.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { NewPatientComponent } from './new-patient/new-patient.component';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { CookieService } from 'ngx-cookie-service';
import { StorageServiceModule } from 'angular-webstorage-service';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { LogoutComponent } from './logout/logout.component';
import { AddAnamnesisComponent } from './add-anamnesis/add-anamnesis.component';
import { MatStepperModule, MatSelectModule, MatOptionModule, MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PatientComponent,
    AddcellsComponent,
    ReviewComponent,
    ToolbarComponent,
    ContentComponent,
    NotFoundComponent,
    LoaderComponent,
    NewPatientComponent,
    LoginComponent,
    StartupComponent,
    SignupComponent,
    AboutComponent,
    LogoutComponent,
    AddAnamnesisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FilterPipeModule,
    InterceptorModule,
    StorageServiceModule,
    MatStepperModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule
  ],
  providers: [
    CookieService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
