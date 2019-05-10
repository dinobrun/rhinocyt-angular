import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingService } from './shared/services/loading.service';
import { LoadingInterceptor } from './shared/loading-interceptor';

import { NgModule } from '@angular/core';


@NgModule({
    providers: [
      LoadingService,
      { provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true
      }
    ]
})

export class InterceptorModule {}

