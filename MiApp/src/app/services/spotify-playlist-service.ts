import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyPlaylistResponse } from '../../interfaces/spotify-playlist-response.js';
import { CookieStorageService } from './general/cookie-storage-service.js';

@Injectable({
  providedIn: 'root'
})
export class SpotifyPlaylistService {

  constructor(
    private _http: HttpClient,
    private _cookieStorageService: CookieStorageService
  ){ }

  getPlaylist(token: string): Observable<SpotifyPlaylistResponse>{


    

    return this._http.get<SpotifyPlaylistResponse>(
      "https://api.spotify.com/v1/playlists/5J7iA3jjhiTjoZAK7a3Y8A",
      {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
    )

  }
  
}
