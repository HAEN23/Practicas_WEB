import { Component, computed, inject } from '@angular/core';
import { MusicPlayerService } from '../services/music-player.service';

@Component({
  selector: 'app-info-song',
  standalone: false,
  templateUrl: './info-song.html',
  styleUrl: './info-song.css'
})
export class InfoSong {
  private musicService = inject(MusicPlayerService);
  
  currentSong = this.musicService.currentSong;
  playlist = this.musicService.playlist;
  availableSongs = computed(() => this.musicService.getSongs());

  selectSong(song: any) {
    this.musicService.selectSong(song);
  }

  addToPlaylist(song: any) {
    this.musicService.addToPlaylist(song);
  }
}

