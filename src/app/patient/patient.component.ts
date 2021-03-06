import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Patient, Doctor, CellExtraction, Cell, CellCategory, ModelList } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { SidenavItem } from '../shared/classes/sidenav-item';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {





//----------------------PARTE RELATIVA AL PAGINATORE---------------------------
  // MatPaginator Inputs
  length = 1000;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;
  activePageDataChunk = []

  generateContent() {
    this.activePageDataChunk = this.extractions.slice(0,this.pageSize);
    this.length = this.extractions.length;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.activePageDataChunk = this.extractions.slice(firstCut, secondCut);
  }
//-------------------FINE PARTE RELATIVA AL PAGINATORE-------------------------



















  public patient: Patient;
  public extractions: CellExtraction[] = [];

  public error : boolean = false;

  public sidenavItems: SidenavItem [] = [
    SidenavItem.internalLink("Dashboard", "/dashboard", {icon: 'dashboard'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Add Cells", "addcells", {icon: 'add_box'}),
    SidenavItem.internalLink("Anamnesis", "anamnesis", {icon: 'description'}),
    SidenavItem.internalLink("Diagnosis", "diagnosis", {icon: 'assignment'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Report PDF", "report-pdf", {icon: 'assessment'}),
    SidenavItem.internalLink("Patient Register", "", {icon: 'assignment_ind', disabled: true}),
    SidenavItem.internalLink("Import/Export", "", {icon: 'import_export', disabled: true}),
  ];

  constructor( private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
     
    }

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
        this.generateContent();         
      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });
  }
}
