// src/app/services/spotify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class SpotifyService {
  private clientId = '9944d71af81a4b06a0722ac659d82858';
  private clientSecret = '498b8a8723794bf5aefe693197effd66';
  
  // URLs de redirección (deben estar registradas en Spotify Dashboard)
  private redirectUri = 'https://www.google.com';

  constructor(private http: HttpClient) {}
  
  async getAccessToken(): Promise<string> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    return data.access_token;
  }

  
  loginUser(): void {
    console.log('=== INICIANDO LOGIN SPOTIFY ===');
    
    const scopes = [
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-read-playback-state',
      'user-modify-playback-state',
      'playlist-read-private',
      'playlist-read-collaborative'
    ].join(' ');
    
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${this.clientId}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `show_dialog=true`;
    
    console.log('Client ID:', this.clientId);
    console.log('Redirect URI:', this.redirectUri);
    console.log('URL completa:', authUrl);
    
    // Verificar que window existe
    if (typeof window !== 'undefined') {
      console.log('✅ Redirigiendo a Spotify...');
      window.location.href = authUrl;
    } else {
      console.error('❌ Window no está disponible');
    }
  }

  // Método para intercambiar código por token de acceso completo
  async getTokenFromCode(code: string): Promise<any> {
    console.log('🔄 Intercambiando código por token...');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(this.redirectUri)}`
    });
    
    const data = await response.json();
    console.log('🎫 Token response:', data);
    
    if (data.access_token) {
      // Guardar token en localStorage para uso posterior
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_refresh_token', data.refresh_token || '');
      console.log('✅ Token guardado exitosamente');
    }
    
    return data;
  }

  // Método para detectar código en URL automáticamente
  checkForSpotifyCode(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log('🎫 Código de Spotify detectado automáticamente:', code.substring(0, 20) + '...');
      this.getTokenFromCode(code).then(tokenData => {
        console.log('✅ Token automático obtenido:', tokenData);
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch(error => {
        console.error('❌ Error con código automático:', error);
      });
    }
  }

  // Método para obtener token guardado o crear uno nuevo
  async getValidAccessToken(): Promise<string> {
    // Verificar si hay código en la URL primero
    this.checkForSpotifyCode();
    
    // Intentar usar token guardado
    const savedToken = localStorage.getItem('spotify_access_token');
    if (savedToken) {
      console.log('🎫 Usando token guardado');
      return savedToken;
    }
    
    // Si no hay token guardado, usar client credentials
    console.log('🎫 Obteniendo nuevo token client credentials');
    return await this.getAccessToken();
  }

  async searchTracks(query: string) { /* ... */ }
  async getUserPlaylists() { /* ... */ }
}