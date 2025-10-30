import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Album } from '../../interfaces/album';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAlbumService {
  
  private readonly AUTH_URL = 'https://accounts.spotify.com/api/token';
  private readonly API_URL = 'https://api.spotify.com/v1';
  
  constructor(
    private _http: HttpClient
  ) { }

  // Obtener token de acceso para Spotify API
  getAccessToken(): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', environment.spotify.clientId)
      .set('client_secret', environment.spotify.clientSecret);

    return this._http.post<any>(
      this.AUTH_URL,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }

  // Obtener información de un álbum específico
  getAlbum(albumId: string): Observable<Album> {
    return this._http.get<Album>(`${this.API_URL}/albums/${albumId}`);
  }

  // Obtener múltiples álbumes
  getAlbums(albumIds: string[]): Observable<{ albums: Album[] }> {
    const ids = albumIds.join(',');
    return this._http.get<{ albums: Album[] }>(`${this.API_URL}/albums?ids=${ids}`);
  }

  // Obtener tracks de un álbum
  getAlbumTracks(albumId: string, limit: number = 50, offset: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    
    return this._http.get<any>(`${this.API_URL}/albums/${albumId}/tracks`, { params });
  }

  // Buscar álbumes
  searchAlbums(query: string, limit: number = 20, offset: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'album')
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    
    return this._http.get<any>(`${this.API_URL}/search`, { params });
  }

}
