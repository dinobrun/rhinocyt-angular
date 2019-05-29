import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Patient, CellExtraction, Report, Anamnesis } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { SidenavItem } from '../shared/classes/sidenav-item';

@Component({
  selector: 'app-report-pdf',
  templateUrl: './report-pdf.component.html',
  styleUrls: ['./report-pdf.component.scss']
})
export class ReportPdfComponent implements OnInit {

  public patient: Patient;
  public anamnesis: Anamnesis;
  public cellExtraction: CellExtraction;
  public report: Report = {};

  public error: boolean = false;

  public params: HttpParams;

  public sidenavItems: SidenavItem [] = [
    SidenavItem.internalLink("Dashboard", "/dashboard", {icon: 'dashboard'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Add Cells", "../addcells", {icon: 'add_box'}),
    SidenavItem.internalLink("Anamnesis", "../anamnesis", {icon: 'description'}),
    SidenavItem.internalLink("Diagnosis", "../diagnosis", {icon: 'assignment'}),
    SidenavItem.separator(),
    SidenavItem.selectedLable("Report PDF", "", {icon: 'assessment'}),
    SidenavItem.internalLink("Patient Register", "", {icon: 'assignment_ind', disabled: true}),
    SidenavItem.internalLink("Import/Export", "", {icon: 'import_export', disabled: true}),
  ];



  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    //get patient istance
    this.apiService.Patient().get(id).subscribe(
      (data: Patient) => {
        this.patient = data;
        if(this.patient == undefined){
          this.error = true;
        }
      });

    this.params = new HttpParams()
      //get last andamnesis
      this.apiService.Anamnesis().last(id)
      .subscribe((data: Anamnesis) => {
        this.anamnesis = data;
        //if there is an anamnesis
        if(data.id != null){
          this.params = this.params.set('anamnesis', String(this.anamnesis.id))
        }

      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });

      //get last cell extraction
      this.apiService.CellExtraction().last(id)
      .subscribe((data: CellExtraction) => {
        this.cellExtraction = data;

        if(data.id != null){
          this.params = this.params.set('cell_extraction', String(this.cellExtraction.id))
        }

        console.log("ultima estrazione", this.cellExtraction)
      },
      error => {
        if(isDevMode()){
          console.log(error);
        }
      });
  }

  ifAlreadyExist() {
    //get list of anamnesis
    this.apiService.Report().query(this.params)
    .subscribe((data: Report[]) => {
      //if has been already generated
      if (data.length > 0){
        this.report = data[0];
        //open the file
        window.open(this.report.report_file);
      }else{
        //generate a new one
        this.requestPDF();
      }
    },
    error => {
      if(isDevMode()){
        console.log(error);
      }
    });
  }

  requestPDF() {
    this.report.anamnesis = this.anamnesis.id;
    this.report.cell_extraction = this.cellExtraction.id;

    this.apiService.Report().create(this.report)
    .subscribe((data: Report) => {
      this.report = data;
      console.log("report", data)
    },
    error => {
      if(isDevMode()){
        console.log(error);
      }
    },
    () =>{
      window.open(this.report.report_file);
    });
  }




}
