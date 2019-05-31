import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Doctor } from '../../interfaces/api-models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  public doctor: Doctor = {} as Doctor;

  constructor(public authService: AuthService, private location: Location) {  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  ngOnInit() {
    if (this.authService.getDoctor() === undefined) {
      this.authService.onFetchData()
                      .subscribe((event) => this.doctor = this.authService.getDoctor());
    } else {
      this.doctor = this.authService.getDoctor();
    }
  }
}
