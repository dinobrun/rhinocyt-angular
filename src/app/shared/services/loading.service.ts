import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public loading : boolean = false;
  public progress : number = 0;
  public totalOp : number = 0;
  public currentInd : number = 0;

  constructor() { }

  public setLoading(isLoading: boolean) : void {
  	this.loading = isLoading;
  }

  public setProgress(new_progress : number ) : number {
  	return this.progress = new_progress;
  }
  public updateProgress( ) {
    if(this.totalOp<=0){
      this.progress=0;
    }
    else	this.progress=((this.currentInd/this.totalOp)*100);
    //console.log("c:"+this.currentInd+" t:" + this.totalOp + "Percentuale: " + this.progress );
  }
}
