import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';
import { ModelList, CellExtraction, Doctor, Patient } from '../shared/interfaces/api-models';
import { SidenavItem } from '../shared/classes/sidenav-item';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public doctor: Doctor;
  public cellExtractions: any[];

  public patientFilter: {fiscal_code: string} = {fiscal_code: ''};
  public patients: any[];

  public sidenavItems: SidenavItem [] = [
    SidenavItem.selectedLable("Dashboard", " ", {icon: 'dashboard'}),
    SidenavItem.separator()
  ];

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private apiService: ApiService,
              private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/']);
    }

    this.fetchDoctor();
  //this.fetchCellExtractions();
  }

  ngAfterViewInit(){
    document.getElementById("btnHome").style.visibility = "hidden";
    document.getElementById("btnBack").style.visibility = "hidden";
  }

  private fetchDoctor() {
    if (this.authService.getDoctor() === undefined) {
      this.authService.onFetchData()
          .subscribe((event) => this.setDoctor(this.authService.getDoctor()));
    } else {
      this.setDoctor(this.authService.getDoctor());
      this.apiService.Doctor().get(this.doctor.id)
                              .subscribe((doctor: Doctor) => this.setDoctor(doctor));
    }
  }

  private setDoctor(doctor: Doctor) {
    this.doctor = doctor;
    this.patients = doctor.patients;
    this.patients.map((patient) => {
      patient.fullName = patient.last_name + ' ' + patient.first_name;
      patient.initials = patient.last_name[0] + patient.first_name[0];
    });
  }


  public clearPatientFilter(input) {
    input.value = '';
    input.focus();
    this.patientFilter.fiscal_code = '';
  }

}
