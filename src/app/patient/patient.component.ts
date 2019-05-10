import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Patient, Doctor, CellExtraction, Cell, CellCategory, ModelList } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { SidenavItem } from '../shared/classes/sidenav-item';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  public patient: Patient;
  public extractions: CellExtraction[] = [];

  public error : boolean = false;

  public sidenavItems: SidenavItem [] = [
    SidenavItem.internalLink("Add Cells", "addcells", {icon: 'add_box'}),
    SidenavItem.internalLink("Anamnesis", "", {icon: 'description', disabled: true}),
    SidenavItem.internalLink("Diagnosis", "", {icon: 'assignment', disabled: true}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Report", "", {icon: 'assessment', disabled: true}),
    SidenavItem.internalLink("Patient Register", "", {icon: 'assignment_ind', disabled: true}),
    SidenavItem.internalLink("Import/Export", "", {icon: 'import_export', disabled: true}),
  ];

  constructor( private apiService: ApiService, private route: ActivatedRoute, private router: Router) {  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.apiService.Patient().get(id)
    .subscribe(
    	(data: Patient) => {
    		this.patient = data;
    		if(this.patient == undefined){
    			this.error = true;
    		}
		  },
  		error => {
        if(isDevMode()){
          console.log(error);
        }
  		});

    let params = new HttpParams()
    params = params.set('patient', String(id));

    this.apiService.CellExtraction().query(params)
    .subscribe(
      (data: CellExtraction[]) => {
        this.extractions = data;
        console.log("Extractions:", this.extractions);
      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });
  }
}
