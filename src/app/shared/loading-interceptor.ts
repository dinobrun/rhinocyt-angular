import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';
import { of } from 'rxjs';
import { AddcellsComponent } from '../addcells/addcells.component';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests     :number = 0;
  private initTotalRequests :number = 0;
  private countReqSadisf    :number = 0;

constructor(private loadingService: LoadingService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.totalRequests++;
    this.loadingService.currentInd++;
    this.loadingService.updateProgress();
    this.loadingService.setLoading(true);
    return next.handle(request).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          this.decreaseRequests();
          console.log("progress: "+(this.loadingService.currentInd));
        }
      }),
      catchError(err => {
        this.decreaseRequests();
        throw err;
      })
    );
  }

  private decreaseRequests() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      this.initTotalRequests = 0;
      this.loadingService.setLoading(false);
      //this.loadingService.progress=0;
      //this.loadingService.totalOp=0;;
      //this.loadingService.currentInd=0;
    }
  }
}
