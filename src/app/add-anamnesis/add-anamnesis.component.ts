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
  public anamnesis: Anamnesis = {};

  private ALLERG_TYPE: Choice[] = [
    {key: 'AL', value: 'alimenti'},
    {key: 'IN', value: 'inalanti'}
  ];

  private LEFT_RIGHT_TYPE: Choice[] = [
    {key: 'SX', value: 'sinistra'},
    {key: 'DX', value: 'destra'},
    {key: 'EX', value: 'bilaterale'}
  ];

  private RINORREA_ESSUDATO_TYPE: Choice[] = [
    {key: 'SI', value: 'sieroso'},
    {key: 'MU', value: 'mucoso'},
    {key: 'PU', value: 'purulento'},
    {key: 'EM', value: 'ematico'}
  ];

  private STARNUTAZIONE_TYPE: Choice[] = [
    {key: 'SP', value: 'sporadica'},
    {key: 'AS', value: 'a salve'}
  ];

  private PROB_OLF_TYPE: Choice[] = [
    {key: 'IP', value: 'iposmia'},
    {key: 'AN', value: 'anosmia'},
    {key: 'CA', value: 'cacosimia'}
  ];

  private SINDR_VER_TYPE: Choice[] = [
    {key: 'SO', value: 'soggettiva'},
    {key: 'OG', value: 'oggettiva'}
  ];

  private PIR_NAS_TYPE: Choice[] = [
    {key: 'NFM', value: 'normoformata'},
    {key: 'GIB', value: 'gibbo'},
    {key: 'SCO', value: 'scoiosi'},
    {key: 'DEF', value: 'deformazioni varie'}
  ];

  private VALV_NAS_TYPE: Choice[] = [
    {key: 'NFN', value: 'normofunzionante'},
    {key: 'INS', value: 'insufficienza sinistra'},
    {key: 'IND', value: 'insufficienza destra'},
    {key: 'INE', value: 'insufficienza bilaterale'}
  ];

  private SETTO_NAS_TYPE: Choice[] = [
    {key: 'ASS', value: 'in asse'},
    {key: 'DVS', value: 'deviato a sinistra'},
    {key: 'DVD', value: 'deviato a destra'},
    {key: 'ESI', value: 'esse italica'}
  ];

  private TURB_TYPE: Choice[] = [
    {key: 'NTR', value: 'normotrofici'},
    {key: 'IPT', value: 'ipertrofici'},
    {key: 'IPE', value: 'iperemici'},
    {key: 'EMA', value: 'ematosi'}
  ];



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
  onSubmit() {
    this.anamnesis.patient = this.patient.id;

    this.apiService.Anamnesis().create(this.anamnesis)
    .subscribe(
      (anamnesis: Anamnesis) => {
        this.anamnesis = anamnesis;
      },
      error => {
        console.log(error);
      },
      () => {
        console.log("weeeeeeeeee");;
      });
  }

}
