import { Component, OnInit, isDevMode} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Patient, Anamnesis, Allergy, ModelList} from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { SidenavItem } from '../shared/classes/sidenav-item';


export class Choice {
  key: string;
  value: string;
}

@Component({
  selector: 'app-review-anamnesis',
  templateUrl: './review-anamnesis.component.html',
  styleUrls: ['./review-anamnesis.component.scss']
})
export class ReviewAnamnesisComponent implements OnInit {

  public patient: Patient;
  public anamnesis: Anamnesis = {};
  public anamnesis_test: Anamnesis = {};
  public allergy_list: Allergy[] = [];
  public allergySelectedList: Allergy[] = [];

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

  private POLIP_NUM_TYPE: Choice[] = [
    {key: "1", value: "1"},
    {key: "2", value: "2"},
    {key: "3", value: "3"},
    {key: "4", value: "4"}
  ]

  public error: boolean = false;
  public prickTest: boolean = false;
  public precisionInput:number = 0.01;


  public sidenavItems: SidenavItem [] = [
    SidenavItem.internalLink("Dashboard", "/dashboard", {icon: 'dashboard'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Add Cells", "../../addcells", {icon: 'add_box'}),
    SidenavItem.selectedLable("Anamnesis", "../", {icon: 'description'}),
    SidenavItem.internalLink("Diagnosis", "../../diagnosis", {icon: 'assignment'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Report PDF", "../../report-pdf", {icon: 'assessment'}),
    SidenavItem.internalLink("Patient Register", "", {icon: 'assignment_ind', disabled: true}),
    SidenavItem.internalLink("Import/Export", "", {icon: 'import_export', disabled: true}),
  ];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.apiService.Patient().get(id).subscribe(
      (data: Patient) => {
        this.patient = data;
        this.anamnesis.patient = data.id;
        if(this.patient == undefined){
          this.error = true;
        }
      });


    //set limit of objects to retrieve
    let params = new HttpParams()
    params = params.set('limit', '18');

    //get all allergy from server
    this.apiService.Allergy().query(params).subscribe( (data: Allergy[]) =>
    	{
    		this.allergy_list = data;
        if(isDevMode()){
         console.log("Allergies: ", data);
        }
    	});


    //get annamnesis id
    const id_anamnesis = +this.route.snapshot.paramMap.get('anamnesis_id');
    this.apiService.Anamnesis().get(id_anamnesis).subscribe(
      (data: Anamnesis) => {
        this.anamnesis = data;
        if(data.prick_test.length > 0){
          this.prickTest = true;
          for (const dato of data.prick_test){
            this.allergy_list[dato.allergy-1].value = true;
          }
        }
      });




  }


  onSubmit() {
    //if prick test is positive
    if (this.prickTest == true){
      for(const allergy_temp of this.allergy_list){
        //get all selected allergies
        if (allergy_temp.value == true){
          this.allergySelectedList.push(allergy_temp)
        }
      }
    }


    let data = {
      anamnesis: this.anamnesis,
      allergyList: this.allergySelectedList
    }

    //delete the actual anamnesis before update with the new one
    this.apiService.Anamnesis().delete(this.anamnesis.id)
    .subscribe(
      (anamnesis: Anamnesis) => {
        console.log("eliminato", anamnesis.id)
      }
    )

    //create new anamnesis 
    this.apiService.Anamnesis().create(data)
    .subscribe(
      (anamnesis: Anamnesis) => {
        this.anamnesis_test = anamnesis;
      },
      error => {
        console.log(error);
      },
      () => {
        this.router.navigate(['/dashboard/patient/' + this.patient.id + '/anamnesis']);
      });

  }

}
