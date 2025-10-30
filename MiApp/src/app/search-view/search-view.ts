import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MusicPlayerService } from '../services/music-player.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-view',
  standalone: false,
  templateUrl: './search-view.html',
  styleUrl: './search-view.css'
})
export class SearchView {
  private musicService = inject(MusicPlayerService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  // Obtener resultados de búsqueda del servicio
  get searchResults() {
    return this.searchService.searchResults();
  }

  onPlayTrack(track: any): void {
    console.log('🎵 Reproduciendo desde búsqueda:', track.name);
    this.musicService.addToPlaylist(track);
    this.musicService.selectSong(track);
  }

  onAddToPlaylist(track: any): void {
    this.musicService.addToPlaylist(track);
    console.log('➕ Agregado a playlist:', track.name);
  }

  onClearSearch(): void {
    this.searchService.clearResults();
    this.router.navigate(['/home']);
  }

  // Obtener información del reproductor actual
  get currentSong() {
    return this.musicService.currentSong();
  }

  get isPlaying() {
    return this.musicService.isPlaying();
  }

  // Formatear duración de milisegundos a MM:SS
  formatDuration(ms: number): string {
    if (!ms) return '0:00';
    
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Verificar si el track actual está siendo reproducido
  isCurrentTrackPlaying(track: any): boolean {
    const currentSong: any = this.currentSong;
    if (!currentSong || !track) return false;
    
    // Los tracks de Spotify tienen 'id', los locales usan 'song_name'
    if (track.id && (currentSong as any).id) {
      return track.id === (currentSong as any).id;
    }
    
    // Fallback: comparar por nombre de canción y artista
    const trackName = track.name || track.song_name || '';
    const trackArtist = track.artists?.[0]?.name || track.artist_name || '';
    const currentName = (currentSong as any).name || currentSong.song_name || '';
    const currentArtist = (currentSong as any).artists?.[0]?.name || currentSong.artist_name || '';
    
    return trackName.toLowerCase() === currentName.toLowerCase() && 
           trackArtist.toLowerCase() === currentArtist.toLowerCase();
  }
}