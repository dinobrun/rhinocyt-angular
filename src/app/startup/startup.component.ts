import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Doctor } from '../shared/interfaces/api-models';
import { AuthService } from '../shared/services/auth.service';
import { ApiService } from '../shared/services/api.service';


@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent implements OnInit {

  constructor(private router: Router,
              private apiService: ApiService,
              private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLogged()) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
    }
  }

}
