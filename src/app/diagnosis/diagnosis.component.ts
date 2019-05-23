import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Patient, Anamnesis, DiagnosisExtraction, CellExtraction } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { SidenavItem } from '../shared/classes/sidenav-item';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.scss']
})
export class DiagnosisComponent implements OnInit {

  public patient: Patient;
  public diagnosis_list: DiagnosisExtraction[];
  public last_anamnesis: Anamnesis;
  public last_cell_extraction: CellExtraction;

  public error : boolean = false;

  public sidenavItems: SidenavItem [] = [
    SidenavItem.internalLink("Dashboard", "/dashboard", {icon: 'dashboard'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Add Cells", "../addcells", {icon: 'add_box'}),
    SidenavItem.internalLink("Anamnesis", "../anamnesis", {icon: 'description'}),
    SidenavItem.selectedLable("Diagnosis", " ", {icon: 'assignment'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Report", "", {icon: 'assessment', disabled: true}),
    SidenavItem.internalLink("Patient Register", "", {icon: 'assignment_ind', disabled: true}),
    SidenavItem.internalLink("Import/Export", "", {icon: 'import_export', disabled: true}),
  ];


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

      this.apiService.DiagnosisExtraction().query(params)
      .subscribe((data: DiagnosisExtraction[]) => {
        this.diagnosis_list = data;
        console.log("diagnosi", this.diagnosis_list)
      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });


      //get last andamnesis
      this.apiService.Anamnesis().last(id)
      .subscribe((data: Anamnesis) => {
        this.last_anamnesis = data;
        console.log("ultima anamnesis", this.last_anamnesis)
      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });

      //get last cell extraction
      this.apiService.CellExtraction().last(id)
      .subscribe((data: CellExtraction) => {
        this.last_cell_extraction = data;
        console.log("ultima estrazione", this.last_cell_extraction)
      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });
  }


  public addDiagnosis(): void{
    let diagnosis : DiagnosisExtraction = {};
    console.log("chiamato")

    diagnosis.patient = this.patient.id;
    diagnosis.anamnesis = this.last_anamnesis.id;
    diagnosis.cell_extraction = this.last_cell_extraction.id;

    this.apiService.DiagnosisExtraction().create(diagnosis)
    .subscribe((data: DiagnosisExtraction) => {
      console.log("ultima estrazione", data)
    },
    error => {
      if(isDevMode()){
        console.log(error);
      }
    });
  }

}
