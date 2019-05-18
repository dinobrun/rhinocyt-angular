import { Component, OnInit, isDevMode} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Patient, Anamnesis } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { SidenavItem } from '../shared/classes/sidenav-item';

export class Choice {
  key: string;
  value: string;
}

@Component({
  selector: 'app-add-anamnesis',
  templateUrl: './add-anamnesis.component.html',
  styleUrls: ['./add-anamnesis.component.scss']
})
export class AddAnamnesisComponent implements OnInit {

  public patient: Patient;
  public anamnesis: Anamnesis;

  private ALLERG_TYPE: Choice[] = [
    {key: 'AL', value: 'alimenti'},
    {key: 'IN', value: 'inalanti'}
  ];

  public allergy_gen: string;

  public anamnesis_test: Anamnesis[] = [];

  public error: boolean = false;

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















/**
      let params = new HttpParams()
      params = params.set('patient', String(id));

      this.apiService.Anamnesis().query(params)
      .subscribe((data: Anamnesis[]) => {

        console.log("Anamnesis:", data);
      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });
*/
  }

}
