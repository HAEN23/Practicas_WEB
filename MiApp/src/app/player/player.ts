import { Component, OnInit, inject } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { MusicPlayerService } from '../services/music-player.service';
import { Album } from '../interfaces/album';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {
  private spotifyService = inject(SpotifyService);
  private musicService = inject(MusicPlayerService);

  currentAlbum: Album | null = null;
  currentSong = this.musicService.currentSong;
  isPlaying = this.musicService.isPlaying;
  playlist = this.musicService.playlist;
  currentIndex = this.musicService.currentIndex;

  constructor() {}

  ngOnInit(): void {
    console.log('🎵 Player inicializado');
  }

  // Métodos de control del reproductor
  playPause(): void {
    this.musicService.playPause();
  }

  nextSong(): void {
    this.musicService.nextSong();
  }

  previousSong(): void {
    this.musicService.previousSong();
  }

  // Método para cargar una canción específica
  loadSong(song: any, autoPlay: boolean = false): void {
    this.musicService.loadSong(song, autoPlay);
  }

  // Obtener información del álbum actual
  async loadCurrentAlbum(): Promise<void> {
    const currentSong = this.currentSong();
    if (currentSong?.song_name) {
      try {
        console.log('📀 Cargando información de:', currentSong.song_name);
        // Aquí se puede implementar lógica adicional para obtener más información del álbum
      } catch (error) {
        console.error('❌ Error cargando información:', error);
      }
    }
  }
}
