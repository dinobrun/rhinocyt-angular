import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';
import { Doctor } from '../shared/interfaces/api-models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * The login data of the doctor (username and password)
   */
  public doctor: LoginData = {} as LoginData;

  /**
   * The status of error of the login.
   */
  public loginError = false;

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLogged()) {
      this.router.navigate(['/']);
    }
  }

  public login() {
    this.loginError = false;

    this.apiService.Doctor()
        .login(this.doctor.username, this.doctor.password)
        .subscribe(
          () => this.router.navigate(['/']),
          (error) => this.loginError = true
        );
  }

  public loginDemo() {
    this.loginError = false;

    this.apiService.Doctor()
        .login("demo", "demo")
        .subscribe(
          () => this.router.navigate(['/']),
          (error) => {
            this.loginError = true;
            class Doctor {
              username: string ="demo";
              email: string = "demo@gmail.com";
              first_name: string = "demo";
              last_name: string = "demo";
            }
        
            let doc = new Doctor();
        
            this.apiService.Doctor()
            .signup(this.doctor)
            .subscribe();
          }
        );
  }




}

/**
 * The login data of the doctor.
 */
interface LoginData {
  username: string;
  password: string;
}
