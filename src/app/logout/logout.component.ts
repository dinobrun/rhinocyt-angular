import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  public isDisconnected = false;

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/']);
    }

    this.authService.onLogout()
                    .subscribe((event) => this.isDisconnected = true);

    setTimeout(() => this.authService.logout(), 1500);
  }

}
