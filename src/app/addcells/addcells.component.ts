import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { Patient, CellExtraction } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { LoadingService } from '../shared/services/loading.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { SidenavItem } from '../shared/classes/sidenav-item';

@Component({
  selector: 'app-addcells',
  templateUrl: './addcells.component.html',
  styleUrls: ['./addcells.component.scss']
})
export class AddcellsComponent implements OnInit {

  public progressAddCellN : number = 0 ;

  public filesList;
  public getFileNumber() {
    return this.progressAddCellN;
  }
  public fileModel: string;

  public patient: Patient;
  public cellExtraction: CellExtraction;

  public error: boolean = false;
  public submitted: boolean = false;

  public sidenavItems: SidenavItem [] = [
    SidenavItem.internalLink("Dashboard", "/dashboard", {icon: 'dashboard'}),
    SidenavItem.separator(),
    SidenavItem.selectedLable("Add Cells", " ", {icon: 'add_box'}),
    SidenavItem.internalLink("Anamnesis", "../anamnesis", {icon: 'description'}),
    SidenavItem.internalLink("Diagnosis", "../diagnosis", {icon: 'assignment'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Report PDF", "../report-pdf", {icon: 'assessment'}),
    SidenavItem.internalLink("Patient Register", "", {icon: 'assignment_ind', disabled: true}),
    SidenavItem.internalLink("Import/Export", "", {icon: 'import_export', disabled: true}),
  ];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router,
              private loadingService: LoadingService) {
                this.loadingService.currentInd = 0;
                this.loadingService.progress = 0;  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.apiService.Patient().get(id).subscribe(
      (data: Patient) => {
        this.patient = data;
        if(this.patient == undefined){
          this.error = true;
        }
      });
      this.loadingService.currentInd = 0;
      this.loadingService.progress = 0;
  }

  /**
   * Execute extraction (and classification) of given \p slides.
   * @param data Data to process.
   */
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
      dataSlides.push({image: file, patient: this.patient.id});
      this.progressAddCellN++;
    }

    this.enableProgressBarDet(this.progressAddCellN);

    let data = {
      patient: this.patient.id,
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
}
