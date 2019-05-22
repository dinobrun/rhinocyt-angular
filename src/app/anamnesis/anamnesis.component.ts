import { Component, OnInit , isDevMode} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Patient, Anamnesis } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { SidenavItem } from '../shared/classes/sidenav-item';

@Component({
  selector: 'app-anamnesis',
  templateUrl: './anamnesis.component.html',
  styleUrls: ['./anamnesis.component.scss']
})
export class AnamnesisComponent implements OnInit {

  public anamnesis_list: Anamnesis[] = [];
  public patient: Patient;
  public error: Boolean = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.apiService.Patient().get(id).subscribe(
      (data: Patient) => {
        this.patient = data;
        if(this.patient == undefined){
          this.error = true;
        }
      });


      //get list of anamnesis
      let params = new HttpParams()
      params = params.set('patient', String(id));

      this.apiService.Anamnesis().query(params)
      .subscribe((data: Anamnesis[]) => {
        this.anamnesis_list = data;
        console.log("Anamnesis:", data);
      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });
  }

}
