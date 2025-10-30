import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService {
  
  constructor(
    private _cookieService: CookieService
  ) {}

  getCookieValue(key: string): string {
    return this._cookieService.get(key);
  }

  createCookie(key: string, value: string, expires:| Date | undefined): void {
    this._cookieService.set(key, value, expires);
  }

  deleteCookie(key: string): void {
    this._cookieService.delete(key);
  }

  checkCookie(key: string): boolean {
    return this._cookieService.check(key);
  }

 setCookie(key: string, value: string): void {
    this._cookieService.set(key, value);

  }

}
