import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Doctor } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public doctor: any = {};

  constructor(private router: Router,
              private apiService: ApiService,
              private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLogged()) {
      this.router.navigate(['/']);
    }
  }

  public signup() {
    this.authService.onLogin()
                    .subscribe(() => this.router.navigate(['/']));

    this.apiService.Doctor()
                   .signup(this.doctor)
                   .subscribe();
  }

}
