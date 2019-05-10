import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {CellExtraction, Cell, CellCategory, Slide, ModelList } from '../shared/interfaces/api-models';
import { ApiService } from '../shared/services/api.service';
import { LoadingService } from '../shared/services/loading.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { SidenavItem } from '../shared/classes/sidenav-item';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  public validated: boolean = true;
  public saved: boolean = false;
  public error: boolean = false;

  public cellCategories: CellCategory[];
	public cellExtraction: CellExtraction;
  public slides: Slide[];
  public cellsToDelete: Cell[] = [];

  public cellByCat = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: []
}

  constructor(private apiService: ApiService, private route: ActivatedRoute, 
              public loadingService: LoadingService) { 
  }

  ngOnInit() {
  	const id = +this.route.snapshot.paramMap.get('id');
    //Get the cell extractions and cells
  	let req = this.apiService.CellExtraction().get(id).subscribe( 
      (data: CellExtraction) => {
        this.cellExtraction = data; 
        if(this.cellExtraction == undefined){
          this.error = true;
        }
        this.slides = this.cellExtraction.slides;
        for (let slide of this.slides) {
          for(let cell of slide.cells) {
            this.cellByCat[cell.cell_category].push(cell);
            this.validated = this.validated && cell.validated;
          }
        }
        if(isDevMode()){
          console.log("Cell Extraction: ", this.cellExtraction);
          console.log("List of slides: ", this.slides);
          console.log("Cells are validated? ", this.validated);
          console.log("Object cell by cat", this.cellByCat);
        }
  		});

    console.log(req);

    //Get cell categories
  	this.apiService.CellCategory().all().subscribe( (data: ModelList<CellCategory>) => 
  		{
  			this.cellCategories = data.results;
        if(isDevMode()){
         console.log("Cell categories ", this.cellCategories);  
        }
  		});
  }

  /**
   * Change the category of the given \p cell with the given \p category.
   * @param cellCategory The cell category.
   * @param cell         The cell for which we're going to change the category
   */
  public changeLabel(cellCategory: CellCategory, cell: Cell): void {
    //remove cell from previous category
    let index = this.cellByCat[cell.cell_category].indexOf(cell);
    this.cellByCat[cell.cell_category].splice(index, 1);

    cell.cell_category = cellCategory.id;
    //change cell's category
    this.cellByCat[cellCategory.id].push(cell);


    if (isDevMode()) {
      let log = "Change category of cell " 
                + (cell.id).toString() 
                + " from " 
                + this.cellCategories[cell.cell_category-1].name 
                + " to " 
                + cellCategory.name;

      console.log(log);
    }
  }

  /**
   * Delete from cells array (and therefore from view) the given \p cell.
   * @param cell The cell to delete.
   */
  public deleteCellFromView(cell: Cell){
    let index = this.cellByCat[cell.cell_category].indexOf(cell);
    this.cellByCat[cell.cell_category].splice(index, 1);
    this.cellsToDelete.push(cell);

    if (isDevMode()) {
     let log = "Removing cell " + (cell.id).toString() + " from extraction";
     console.log(log);
    }
  }

  /**
   * Actually delete from CellExtraction the given /p cell.
   * @param cell The cell to delete from extraction.
   */
  private deleteCellFromExtraction(cell: Cell) {
    this.apiService.Cell().delete(cell.id)
    .subscribe(
    (data) => {
      if(isDevMode()){
       console.log("Data returned from delete: ", data);           
      }    
    },
    error => {
      if(isDevMode()){
        console.log("Error delete on review.component: ", error);
      }
    });        
  }

  /**
   * Actually update the given /p cell (it updates at most category and validated flag).
   * @param cell The cell to update.
   */
  private updateCellFromExtraction(cell: Cell) {
    this.apiService.Cell().update({id: cell.id, validated: cell.validated, cell_category: cell.cell_category})
    .subscribe(
    (data) => {
      if(isDevMode()){
       console.log("Data returned from update: ", data);           
      }   
    },
    error => {
      if(isDevMode()){
        console.log("Error update on review.component: ", error);
      }
    },
    () => {
      this.saved = true;
    });
  }

  /*
   * Save all changes performed by user
   */
  onSave() {
    if(isDevMode()){
      console.log("All cell validated? ", this.validated);
    }

    if(this.cellsToDelete.length != 0) {
      for (let cell of this.cellsToDelete) {
        this.deleteCellFromExtraction(cell);
      }
    }
    

    for(let category of this.cellCategories) {
      for (let cell of this.cellByCat[category.id]){
        cell.validated = this.validated;
        this.updateCellFromExtraction(cell);
      }
    }
  }
}