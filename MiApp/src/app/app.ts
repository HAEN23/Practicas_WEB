import { Component, inject } from '@angular/core';
import { MusicPlayerService } from './services/music-player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  private musicService = inject(MusicPlayerService);
  
  title = 'SoundShock';
  
  // Propiedades del reproductor disponibles en el componente principal
  currentSong = this.musicService.currentSong;
  isPlaying = this.musicService.isPlaying;
  
  constructor() {
    // Hacer el servicio accesible globalmente para depuración
    (window as any).musicService = this.musicService;
    console.log('🎵 SoundShock inicializado');
    console.log('🔧 Para probar audio, ejecuta: musicService.testAudio()');
  }
}
