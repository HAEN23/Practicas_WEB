import { Component, inject } from '@angular/core';
import { MusicPlayerService } from '../../../app/services/music-player.service';
import { SpotifyService } from '../../../app/services/spotify.service';

@Component({
  selector: 'app-search-section',
  standalone: false,
  templateUrl: './search-section.html',
  styleUrl: './search-section.css'
})
export class SearchSection {
  private musicPlayer = inject(MusicPlayerService);
  private spotifyService = inject(SpotifyService);
  
  searchResults: any[] = [];
  isLoading = false;

  onSearchResults(results: any[]): void {
    this.searchResults = results;
    this.isLoading = false;
    console.log('🔍 Resultados recibidos:', this.searchResults.length);
  }

  onSearchStart(): void {
    this.isLoading = true;
  }

  playTrack(track: any): void {
    console.log('🎵 Reproduciendo track:', track.name);
    // Si el track tiene preview_url, lo reproducimos usando selectSong
    if (track.preview_url) {
      const song = {
        song_name: track.name,
        artist_name: track.artists?.[0]?.name || 'Artista desconocido',
        song_url: track.preview_url,
        caratula: track.album?.images?.[0]?.url || 'https://via.placeholder.com/300x300/1db954/ffffff?text=♪'
      };
      this.musicPlayer.selectSong(song);
    } else {
      console.warn('⚠️ Este track no tiene preview disponible');
    }
  }

  addToPlaylist(track: any): void {
    console.log('➕ Agregando a playlist:', track.name);
    const song = {
      song_name: track.name,
      artist_name: track.artists?.[0]?.name || 'Artista desconocido',
      song_url: track.preview_url || '',
      caratula: track.album?.images?.[0]?.url || 'https://via.placeholder.com/300x300/1db954/ffffff?text=♪'
    };
    this.musicPlayer.addToPlaylist(song);
  }

  async quickSearch(query: string): Promise<void> {
    console.log('🔍 Búsqueda rápida:', query);
    this.isLoading = true;
    try {
      const results = await this.spotifyService.searchTracks(query);
      this.onSearchResults(results);
    } catch (error) {
      console.error('❌ Error en búsqueda rápida:', error);
      this.isLoading = false;
    }
  }
}
