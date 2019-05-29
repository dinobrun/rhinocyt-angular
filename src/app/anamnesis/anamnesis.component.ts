import { Component, OnInit , isDevMode} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Patient, Anamnesis, CellExtraction } from '../shared/interfaces/api-models';
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

  public sidenavItems: SidenavItem [] = [
    SidenavItem.internalLink("Dashboard", "/dashboard", {icon: 'dashboard'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Add Cells", "../addcells", {icon: 'add_box'}),
    SidenavItem.selectedLable("Anamnesis", " ", {icon: 'description'}),
    SidenavItem.internalLink("Diagnosis", "../diagnosis", {icon: 'assignment'}),
    SidenavItem.separator(),
    SidenavItem.internalLink("Report PDF", "../report-pdf", {icon: 'assessment'}),
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
