import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

	public loading : boolean = false;

  constructor() { }

  public setLoading(isLoading: boolean) : void {
  	this.loading = isLoading;
  }
}
