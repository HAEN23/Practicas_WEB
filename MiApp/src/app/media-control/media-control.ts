import { Component, computed, inject } from '@angular/core';
import { MusicPlayerService } from '../services/music-player.service';

@Component({
  selector: 'app-media-control',
  standalone: false,
  templateUrl: './media-control.html',
  styleUrl: './media-control.css'
})
export class MediaControl {
  private musicService = inject(MusicPlayerService);
  
  // Computed properties que se actualizan automáticamente
  currentSong = this.musicService.currentSong;
  isPlaying = this.musicService.isPlaying;
  progress = this.musicService.progress;
  duration = this.musicService.duration;
  currentTime = this.musicService.currentTime;

  // Formatear tiempo en MM:SS
  formatTime = computed(() => {
    const time = this.currentTime();
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  formatDuration = computed(() => {
    const time = this.duration();
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  playPause() {
    this.musicService.playPause();
  }

  nextSong() {
    this.musicService.nextSong();
  }

  previousSong() {
    this.musicService.previousSong();
  }

  onProgressChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    this.musicService.setProgress(value);
  }
}
