import { Injectable, signal } from '@angular/core';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  private _audio: HTMLAudioElement = new Audio();
  private _currentSong = signal<Song | null>(null);
  private _isPlaying = signal<boolean>(false);
  private _progress = signal<number>(0);
  private _duration = signal<number>(0);
  private _currentTime = signal<number>(0);
  private _playlist = signal<Song[]>([]);
  private _pastSongs = signal<Song[]>([]);
  private _nextSongs = signal<Song[]>([]);
  private _currentIndex = signal<number>(0);

  // Public readonly signals
  readonly currentSong = this._currentSong.asReadonly();
  readonly isPlaying = this._isPlaying.asReadonly();
  readonly progress = this._progress.asReadonly();
  readonly duration = this._duration.asReadonly();
  readonly currentTime = this._currentTime.asReadonly();
  readonly playlist = this._playlist.asReadonly();

  // Lista de canciones por defecto
  private songs: Song[] = [
   
    {
      song_name: "Cuando Calienta El Sol",
      artist_name: "Luis Miguel",
      song_url: "./media/Luis Miguel — Cuando Calienta el Sol [Letra].mp3",
      caratula: "./media/Luismi.jpg"
    },
    {
      song_name: "Thrift Shop",
      artist_name: "Macklemore & Ryan Lewis",
      song_url: "./media/MACKLEMORE & RYAN LEWIS - THRIFT SHOP FEAT. WANZ (OFFICIAL VIDEO).mp3",
      caratula: "./media/thrift.jpg"

    },
    {
      song_name: "Calle Ocho",
      artist_name: "Pitbull",
      song_url: "./media/I Know You Want Me (Calle Ocho).mp3",
      caratula: "./media/Pitbull_i_know_you_want_me_cover.jpg"
    },
    {
      song_name: "I Gotta Feeling",
      artist_name: "Black Eyed Peas",
      song_url: "./media/Black Eyed Peas - I Gotta Feeling (Audio).mp3",
      caratula: "./media/gotta.jpg"
    }
  ];

  constructor() {
    this.initializePlayer();
    this._playlist.set([...this.songs]);
    // Cargar la primera canción automáticamente
    if (this.songs.length > 0) {
      this.loadSong(this.songs[0]);
    }
    
    // Log para verificar que el servicio se inicializa
    console.log('MusicPlayerService inicializado');
    console.log('Canciones disponibles:', this.songs.length);
  }

  private initializePlayer() {
    // Event listener para metadatos cargados
    this._audio.addEventListener('loadedmetadata', () => {
      this._duration.set(this._audio.duration);
      this._progress.set(0);
    });

    // Event listener para actualizar progreso
    this._audio.addEventListener('timeupdate', () => {
      const currentTime = this._audio.currentTime;
      const duration = this._audio.duration;
      
      this._currentTime.set(currentTime);
      if (duration > 0) {
        this._progress.set((currentTime / duration) * 100);
      }
    });

    // Event listener para cuando termina la canción
    this._audio.addEventListener('ended', () => {
      this.nextSong();
    });

    // Event listeners para play/pause
    this._audio.addEventListener('play', () => {
      this._isPlaying.set(true);
    });

    this._audio.addEventListener('pause', () => {
      this._isPlaying.set(false);
    });

    // Event listener para errores
    this._audio.addEventListener('error', (error) => {
      console.error('Error al cargar el audio:', error);
      console.error('URL que falló:', this._audio.src);
      console.error('Código de error:', this._audio.error?.code);
      console.error('Mensaje de error:', this._audio.error?.message);
      this._isPlaying.set(false);
    });

    // Event listener para cuando se puede reproducir
    this._audio.addEventListener('canplay', () => {
      console.log('Audio listo para reproducir:', this._currentSong()?.song_name);
    });

    // Event listener para cuando empieza a cargar
    this._audio.addEventListener('loadstart', () => {
      console.log('Iniciando carga de audio...');
    });
  }

  loadSong(song: Song, autoPlay: boolean = false) {
    console.log('Cargando canción:', song.song_name);
    console.log('URL completa:', song.song_url);
    
    this._currentSong.set(song);
    this._audio.src = song.song_url;
    this._audio.load();
    
    // Actualizar el índice actual
    const index = this.songs.findIndex(s => s.song_name === song.song_name);
    if (index !== -1) {
      this._currentIndex.set(index);
    }
    
    if (autoPlay) {
      // Esperar a que se carguen los metadatos antes de reproducir
      this._audio.addEventListener('canplay', () => {
        console.log('Audio listo para reproducir');
        this._audio.play().catch(error => {
          console.error('Error al reproducir:', error);
        });
      }, { once: true });
    }
  }

  playPause() {
    if (this._isPlaying()) {
      console.log('Pausando audio');
      this._audio.pause();
    } else {
      console.log('Intentando reproducir audio');
      this._audio.play().catch(error => {
        console.error('Error al reproducir:', error);
        console.error('Posible causa: El navegador requiere interacción del usuario');
      });
    }
  }

  selectSong(song: Song) {
    console.log('Seleccionando canción:', song.song_name, 'URL:', song.song_url);
    this._currentSong.set(song);
    this._audio.src = song.song_url;
    this._audio.load();
    
    // Actualizar el índice actual
    const index = this.songs.findIndex(s => s.song_name === song.song_name);
    if (index !== -1) {
      this._currentIndex.set(index);
    }
    
    // Intentar reproducir inmediatamente
    this._audio.play().catch(error => {
      console.error('Error al reproducir al seleccionar:', error);
    });
  }

  nextSong() {
    const currentIndex = this._currentIndex();
    const nextIndex = (currentIndex + 1) % this.songs.length;
    const nextSong = this.songs[nextIndex];
    
    this.loadSong(nextSong, true);
  }

  previousSong() {
    const currentIndex = this._currentIndex();
    const prevIndex = currentIndex === 0 ? this.songs.length - 1 : currentIndex - 1;
    const prevSong = this.songs[prevIndex];
    
    this.loadSong(prevSong, true);
  }

  setProgress(value: number) {
    const duration = this._duration();
    if (duration > 0) {
      this._audio.currentTime = (value / 100) * duration;
    }
  }

  addToPlaylist(song: Song) {
    this._playlist.update(songs => [...songs, song]);
  }

  removeFromPlaylist(index: number) {
    this._playlist.update(songs => songs.filter((_, i) => i !== index));
  }

  getSongs(): Song[] {
    return [...this.songs];
  }
  
  // Método de prueba para diagnosticar problemas
  testAudio() {
    console.log('🔍 DIAGNÓSTICO DE AUDIO');
    console.log('Estado del audio:', {
      src: this._audio.src,
      paused: this._audio.paused,
      currentTime: this._audio.currentTime,
      duration: this._audio.duration,
      volume: this._audio.volume,
      muted: this._audio.muted,
      readyState: this._audio.readyState,
      networkState: this._audio.networkState
    });
    
    // Probar una URL simple
    const testUrl = 'media/gangstas-paradise.mp3';
    console.log('🎵 Probando URL:', testUrl);
    
    this._audio.src = testUrl;
    this._audio.load();
    
    this._audio.addEventListener('canplay', () => {
      console.log('✅ Audio de prueba listo');
      this._audio.play().then(() => {
        console.log('✅ Audio de prueba reproduciendo');
      }).catch(error => {
        console.log('❌ Error reproduciendo audio de prueba:', error);
      });
    }, { once: true });
  }
}