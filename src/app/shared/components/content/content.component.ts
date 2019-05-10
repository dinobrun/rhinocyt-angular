import { Component, OnInit, Input } from '@angular/core';

import { ModelList, Doctor, Patient } from '../../interfaces/api-models';
import { SidenavItem } from '../../classes/sidenav-item';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  /**
   * The state of visibility of the sidenav.
   */
  @Input('sidenav')
  public showSidenav = false;

  /**
   * The sidenav type.
   */
  @Input('sidenav-type')
  public sidenavType: 'dashboard' | 'other' = 'other';

  /**
   * The sidenav items.
   */
  @Input('sidenav-items')
  public sidenavItems: SidenavItem[] = [];

  /**
   * The padding status of the content.
   */
  @Input('content-padding')
  public contentPadding: 'default' | 'none' = 'default';

  /**
   * The status of the error of the content.
   */
  @Input('error')
  public error = false;

  /**
   * The patient list of the doctor.
   */
  public patients: any[] = [];

  /**
   * The patient filter.
   */
  public patientFilter: Object = {fullName: ''};


  constructor(private apiService: ApiService,
              private authService: AuthService) { }


  ngOnInit() {
    // fetch doctor's patients
    if (this.sidenavType === 'dashboard') {
      this.fetchPatients();
    }
  }

  /**
   * Fetches the doctor's patients.
   */
  private fetchPatients() {
    if (this.authService.getDoctor() === undefined) {
      this.authService.onFetchData()
          .subscribe((event) => this.setPatients(this.authService.getDoctor().patients));
    } else {
      this.setPatients(this.authService.getDoctor().patients);
      this.apiService.Doctor().get(this.authService.getDoctor().id).subscribe((doctor: Doctor) => this.setPatients(doctor.patients));
    }
  }

  private setPatients(patients: any[]) {
    this.patients = patients.map((patient) => {
      patient.fullName = `${patient.last_name} ${patient.first_name}`;
      return patient;
    });
  }

}
