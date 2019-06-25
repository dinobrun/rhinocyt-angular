import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';
import { ModelList, CellExtraction, Doctor, Patient } from '../shared/interfaces/api-models';
import { SidenavItem } from '../shared/classes/sidenav-item';

import { isDevMode } from '@angular/core';
import {  NavigationExtras } from '@angular/router';
import { LoadingService } from '../shared/services/loading.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';

function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}

declare const myTest: any;
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  public doctor: Doctor;
  public patient: Patient;
  public cellExtractions: any[];

  public patientFilter: {fiscal_code: string} = {fiscal_code: ''};
  public patients: any[];


  public progressAddCellN : number = 0 ;

  public filesList;
  public getFileNumber() {
    return this.progressAddCellN;
  }
  public fileModel: string;
  public cellExtraction: CellExtraction;

  public error: boolean = false;
  public submitted: boolean = false;

  public isSelectedPatient:boolean=false;
  public selectPatient(){
    this.isSelectedPatient=true;
  }


  public sidenavItems: SidenavItem [] = [
    SidenavItem.selectedLable("Dashboard", "/dashboard", {icon: 'dashboard', disabled: true}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Add Cells", "../addcells", {icon: 'add_box', disabled: true}),
    SidenavItem.internalLink("Anamnesis", " ", {icon: 'description', disabled: true}),
    SidenavItem.internalLink("Diagnosis", "../diagnosis", {icon: 'assignment', disabled: true}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Report PDF", "../report-pdf", {icon: 'assessment', disabled: true}),
    SidenavItem.internalLink("Patient Register", "", {icon: 'assignment_ind', disabled: true}),
    SidenavItem.internalLink("Import/Export", "", {icon: 'import_export', disabled: true}),
  ];

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private apiService: ApiService,
              private authService: AuthService,
              private loadingService: LoadingService
              ) {
                this.loadingService.currentInd = 0; 
                this.loadingService.progress = 0;
              }

  
  ngOnInit() {

    class Doctor  {
      username?: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      patients?: Patient[];
    }
    
    class Patient  {
      first_name?: string;
      last_name?: string;
      fiscal_code?: string;
      birthdate?: string;
      created?: string;
      residence_city?: string;
      birth_city?: string;
      doctor?: number;
      fullName: string ="";
      initials: string ="";
      id?:number =35;
      constructor(){
      this.fullName = "Mario Rossi";
      this.initials = "MR";
      }
    }


    this.patient=new Patient();
    this.doctor=new Doctor();
    
    this.patient.birth_city="Barletta";
    this.patient.first_name="Mario";
    this.patient.last_name="Rossi";
    this.patient.fiscal_code="MRARSS80A09A669K";
    this.patient.birthdate="09/01/1980";
    this.patient.created="03/06/2019";
    this.patient.residence_city="Barletta";
    this.patient.doctor=1;

    this.doctor.username="Medico demo";
    this.doctor.email="lr@doctor.it";
    this.doctor.first_name="Medico";
    this.doctor.last_name="Demo";
    this.doctor.patients=[this.patient];
    this.patients=[this.patient];

 
  }


  public clearPatientFilter(input) {
    input.value = '';
    input.focus();
    this.patientFilter.fiscal_code = '';
  }












  executeExtraction(data: any) : void {
    this.apiService.CellExtraction().create(data)
    .subscribe(
      (cellExtraction: CellExtraction) => {
        console.log("ID: ", cellExtraction.id);
        this.cellExtraction = cellExtraction;
      },
      error => {
        if(isDevMode()) {
          console.log(error);
        }
      },
      () => {
        this.router.navigate(['/dashboard/review', this.cellExtraction.id]);
      });
  }

  onChange(files) {
    this.filesList = files;
    if(isDevMode()) {
      console.log(this.filesList);
    }
  }

  submitCells() {
    //place where extraction and classification start
    this.submitted = true;

    let files = Array.from(this.filesList);

    let dataSlides = [];
    for(let file of files) {
      dataSlides.push({image: file, patient: 35/*this.patient.id*/});
      this.progressAddCellN++;      
    }

    this.enableProgressBarDet(this.progressAddCellN);

    let data = {
      patient: 35,
      slides: dataSlides
    }

    if (isDevMode()) {
      console.log("List of files: ", files);
      console.log("Data slide: ", data);
    }

    this.executeExtraction(data)
  }

  public enableProgressBarDet(totalOp:number){
    this.loadingService.totalOp = totalOp+2;  
    this.loadingService.currentInd = 0; 
    this.loadingService.progress = -1; 
    this.loadingService.loading = true;
  }




  public nextStep(){
    document.getElementById("overlay").style.visibility="hidden";
  }





}

