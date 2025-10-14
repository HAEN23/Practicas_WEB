import { Component, inject } from '@angular/core';
import { MusicPlayerService } from './services/music-player.service';
import { SpotifyService } from './services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  private musicService = inject(MusicPlayerService);
  private spotifyService = inject(SpotifyService);
  
  title = 'SoundShock';
  
  // Propiedades del reproductor disponibles en el componente principal
  currentSong = this.musicService.currentSong;
  isPlaying = this.musicService.isPlaying;
  
  constructor() {
    // Hacer los servicios accesibles globalmente para depuración
    (window as any).musicService = this.musicService;
    (window as any).spotifyService = this.spotifyService;
    console.log('🎵 SoundShock inicializado');
    console.log('🔧 Para probar audio, ejecuta: musicService.testAudio()');
    console.log('🎶 Para probar Spotify login, ejecuta: spotifyService.loginUser()');
  }

  // Método para probar login de Spotify
  testSpotifyLogin() {
    console.log('🎶 Intentando login de Spotify...');
    this.spotifyService.loginUser();
  }

  // Método para recargar playlist de Spotify
  async reloadSpotifyPlaylist() {
    console.log('🔄 Recargando playlist de Spotify...');
    try {
      // Llamar directamente al método del servicio de música
      await this.musicService.loadSpotifyPlaylist();
      console.log('✅ Playlist recargada exitosamente');
    } catch (error) {
      console.error('❌ Error recargando playlist:', error);
    }
  }

  // Método para usar el código de autorización de Spotify
  async useSpotifyCode() {
    const code = prompt('Pega el código de Spotify aquí (después de "code=" en la URL):');
    if (code) {
      try {
        console.log('🎫 Usando código de Spotify:', code.substring(0, 20) + '...');
        const tokenData = await this.spotifyService.getTokenFromCode(code);
        console.log('✅ Token obtenido:', tokenData);
        alert('¡Token de Spotify guardado! Ahora recarga la playlist.');
      } catch (error) {
        console.error('❌ Error con código Spotify:', error);
        alert('Error: ' + error);
      }
    }
  }

  // Métodos para probar navegación
  testNextSong() {
    console.log('🔄 Probando siguiente canción...');
    this.musicService.nextSong();
  }

  testPreviousSong() {
    console.log('🔄 Probando canción anterior...');
    this.musicService.previousSong();
  }

  // Método para mostrar playlist actual
  showCurrentPlaylist() {
    const playlist = this.musicService.playlist();
    const currentIndex = this.musicService.currentSong();
    console.log('📋 Playlist actual:', playlist);
    console.log('🎵 Canción actual:', currentIndex);
    console.log('📊 Total de canciones:', playlist.length);
    alert(`Playlist: ${playlist.length} canciones. Ver consola para detalles.`);
  }
}
