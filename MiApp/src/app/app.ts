import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MusicPlayerService } from './services/music-player.service';
import { SpotifyService } from './services/spotify.service';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  private musicService = inject(MusicPlayerService);
  private spotifyService = inject(SpotifyService);
  private router = inject(Router);
  private searchService = inject(SearchService);
  
  title = 'SoundShock';
  
  // Propiedades del reproductor disponibles en el componente principal
  currentSong = this.musicService.currentSong;
  isPlaying = this.musicService.isPlaying;
  
  // Control dinámico de la barra de búsqueda
  showSearchBar = false;
  searchResults: any[] = [];
  showSearchResults = false;
  
  // Control de navegación simplificado (ahora manejado por router)
  // currentView ya no es necesario con router
  
  // Contadores para hacer la navegación más dinámica
  private homeVisits = 0;
  private playlistVisits = 1; // Empieza en 1 porque es la vista inicial
  
  constructor() {
    // Hacer los servicios accesibles globalmente para depuración
    (window as any).musicService = this.musicService;
    (window as any).spotifyService = this.spotifyService;
    console.log('🎵 SoundShock inicializado');
    console.log('🔧 Para probar audio, ejecuta: musicService.testAudio()');
    console.log('🎶 Para probar Spotify login, ejecuta: spotifyService.loginUser()');
    console.log('🔍 Barra de búsqueda ahora disponible en la parte superior');
    console.log('🎯 Navega a /search para ver resultados de búsqueda');
  }

  // Método para probar login de Spotify
  testSpotifyLogin() {
    console.log(' Intentando login de Spotify...');
    this.spotifyService.loginUser();
  }

  // Método para recargar playlist de Spotify
  async reloadSpotifyPlaylist() {
    console.log(' Recargando playlist de Spotify...');
    try {
      // Llamar directamente al método del servicio de música
      await this.musicService.loadSpotifyPlaylist();
      console.log(' Playlist recargada exitosamente');
    } catch (error) {
      console.error(' Error recargando playlist:', error);
    }
  }

  // Método para usar el código de autorización de Spotify
  async useSpotifyCode() {
    const code = prompt('Pega el código de Spotify aquí (después de "code=" en la URL):');
    if (code) {
      try {
        console.log(' Usando código de Spotify:', code.substring(0, 20) + '...');
        const tokenData = await this.spotifyService.getTokenFromCode(code);
        console.log(' Token obtenido:', tokenData);
        alert('¡Token de Spotify guardado! Ahora recarga la playlist.');
      } catch (error) {
        console.error(' Error con código Spotify:', error);
        alert('Error: ' + error);
      }
    }
  }

  // Métodos para probar navegación
  testNextSong() {
    console.log(' Probando siguiente canción...');
    this.musicService.nextSong();
  }

  testPreviousSong() {
    console.log(' Probando canción anterior...');
    this.musicService.previousSong();
  }

  // Método para mostrar playlist actual
  showCurrentPlaylist() {
    const playlist = this.musicService.playlist();
    const currentIndex = this.musicService.currentSong();
    console.log(' Playlist actual:', playlist);
    console.log(' Canción actual:', currentIndex);
    console.log(' Total de canciones:', playlist.length);
    alert(`Playlist: ${playlist.length} canciones. Ver consola para detalles.`);
  }

  ngOnInit() {
    this.spotifyService.checkForSpotifyCode();
    console.log('App inicializada');
  }

  // Método para mostrar/ocultar la barra de búsqueda
  toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
    console.log('🔍 Barra de búsqueda:', this.showSearchBar ? 'Mostrada' : 'Oculta');
  }

  // Método para ocultar la barra de búsqueda (cuando se termina de buscar)
  hideSearchBar(): void {
    this.showSearchBar = false;
  }

  // Método para manejar los resultados de búsqueda
  onSearchResults(results: any[]): void {
    // Guardar resultados en el servicio compartido
    this.searchService.setSearchResults(results);
    this.searchResults = results;
    
    // Si hay resultados, navegar automáticamente a la vista de búsqueda
    if (results.length > 0) {
      this.router.navigate(['/search']);
      console.log('🔍 ✨ Navegando a vista de búsqueda - Resultados encontrados:', results.length);
    }
  }

  // Método para reproducir una canción desde los resultados
  playSearchResult(track: any): void {
    console.log('🎵 Reproduciendo desde búsqueda:', track.name);
    this.musicService.addToPlaylist(track);
    this.musicService.selectSong(track);
  }

  // Método para agregar canción a la playlist
  addToPlaylistFromSearch(track: any): void {
    this.musicService.addToPlaylist(track);
    console.log('➕ Agregado a playlist:', track.name);
  }

  // Método para limpiar resultados de búsqueda
  clearSearchResults(): void {
    this.searchService.clearResults();
    this.searchResults = [];
    // Navegar a home por defecto
    this.router.navigate(['/home']);
  }

  // Métodos de navegación con Router (ya no son necesarios con routerLink)
  // Los botones de navegación ahora usan routerLink directamente

  // Método para activar animaciones de navegación
  private triggerNavAnimation(view: 'home' | 'playlist'): void {
    const button = document.querySelector(`.${view}-btn`) as HTMLElement;
    if (button) {
      // Agregar clase de animación temporal
      button.classList.add('nav-clicked');
      
      // Remover la clase después de la animación
      setTimeout(() => {
        button.classList.remove('nav-clicked');
      }, 300);
    }
  }

  // Método para efectos de hover en navegación
  onNavHover(view: 'home' | 'playlist' | 'search'): void {
    const messages = {
      home: ['🏠 Explora nueva música', '🎵 Descubre hits', '✨ Tendencias musicales'],
      playlist: ['🎶 Tu música personal', '💫 Tus favoritos', '🎵 Tu colección'],
      search: ['🔍 Busca tu música', '🎵 Encuentra canciones', '✨ Explora artistas']
    };
    
    const randomMessage = messages[view][Math.floor(Math.random() * messages[view].length)];
    console.log(`💭 ${randomMessage}`);
  }
}
