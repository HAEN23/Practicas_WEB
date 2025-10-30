import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import {tap} from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { CookieStorageService } from '../services/general/cookie-storage-service';
import { inject } from '@angular/core';
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const _cookieStorageService: CookieStorageService = inject(CookieStorageService);
  
  return next(req).pipe(
    tap(event => {
      if (!(event.type === HttpEventType.Response)) 
        return;

      const body = event.body as any;
      
      if(!body || !body.access_token)
        return;
      const expirationTime = 60*60*1000;
      const expirationDate = new Date(Date.now() + expirationTime);

      _cookieStorageService.createCookie('access_token', body.access_token, expirationDate);

    
      
}
)
);


};
