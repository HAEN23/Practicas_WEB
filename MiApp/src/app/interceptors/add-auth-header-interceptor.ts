import { HttpInterceptorFn} from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { inject } from '@angular/core';
import { CookieStorageService } from '../services/general/cookie-storage-service';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (req, next) => {

  const _cookieStorage: CookieStorageService = inject(CookieStorageService);

  // Si no existe API_URL en el environment, permitir todas las requests
  if(environment.spotify?.clientId && !req.url.includes('api.spotify.com')) {
    return next(req);
  }

  // Obtener el token de acceso de las cookies
  const accessToken = _cookieStorage.getCookieValue('access_token');
  
  // Si no hay token, continuar sin modificar la request
  if (!accessToken) {
    return next(req);
  }

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${accessToken}`)
  });

  return next(newReq);
};
