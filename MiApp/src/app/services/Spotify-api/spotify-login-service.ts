import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {

  constructor(
    private _http:HttpClient
  ) {  }

  getToken(): Observable<any> {
    const body = new HttpParams()
      .set("grant_type", "client_credentials")
      .set("client_id", "9944d71af81a4b06a0722ac659d82858")
      .set("client_secret", "498b8a8723794bf5aefe693197effd66");
    return this._http.post<any>(
      "https://accounts.spotify.com/api/token", 
      body.toString(),
      {
        headers: {'Content-Type': "application/x-www-form-urlencoded"}
      }
    );

  }
}
