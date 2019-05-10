import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { catchError } from 'rxjs/operators';

import { Doctor } from './shared/interfaces/api-models';
import { ApiService } from './shared/services/api.service';
import { AuthService } from './shared/services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {
    if (this.authService.isLogged()) {
      let params = new HttpParams();
      params = params.set('token', this.authService.getToken());
      this.apiService.Doctor().query(params)
          .subscribe(
            (doctor: Doctor) => this.authService.setDoctor(doctor),
            (error) => {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
          );
    }
  }
}
