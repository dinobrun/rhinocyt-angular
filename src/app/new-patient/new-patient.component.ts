import { Component, OnInit, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

import { Patient, Doctor } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit {

  public first_name: string;
  public last_name: string;
  public fiscal_code?: string;
  public birthdate?: any;
  //public residence_city?: string;
  //public birth_city?: string;
  public doctor: Doctor; //test

 	public patient: Patient = {};

  constructor(private apiService: ApiService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.getDoctor() === undefined) {
      this.authService.onFetchData()
          .subscribe((event) => this.doctor = this.authService.getDoctor());
    } else {
      this.doctor = this.authService.getDoctor();
    }
  }

  onSubmit() {
    console.log("doctor", this.doctor);
  	this.patient.first_name = this.first_name;
  	this.patient.last_name = this.last_name;
    if(this.fiscal_code != undefined) {
      this.patient.fiscal_code = this.fiscal_code;
    }
    if(this.birthdate != undefined) {
          this.patient.birthdate =
            this.birthdate.getFullYear().toString() + "-" +
            (this.birthdate.getMonth()+1).toString() + "-" +
            this.birthdate.getDate().toString();
    }

  	this.patient.doctor = this.doctor.id;

    if(isDevMode()) {
     console.log("Our patient:", this.patient);
    }

  	this.apiService.Patient().create(this.patient)
  		.subscribe(
  			(patient: Patient) => {
  				this.patient = patient;
  			},
  			error => {
  				console.log(error);
  			},
  			() => {
  				this.router.navigate(['dashboard/patient', this.patient.id]);;
  			});
  }

}
