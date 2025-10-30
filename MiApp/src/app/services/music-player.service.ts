import { Injectable, signal } from '@angular/core';
import { Song } from '../models/song.model';
import { SpotifyPlaylistService } from './spotify-playlist-service';
import { SpotifyService } from './spotify.service';

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
  private _currentIndex = signal<number>(0);
  
  readonly currentSong = this._currentSong.asReadonly();
  readonly isPlaying = this._isPlaying.asReadonly();
  readonly progress = this._progress.asReadonly();
  readonly duration = this._duration.asReadonly();
  readonly currentTime = this._currentTime.asReadonly();
  readonly playlist = this._playlist.asReadonly();
  readonly currentIndex = this._currentIndex.asReadonly();

  // Lista de canciones por defecto (como fallback)
  private defaultSongs: Song[] = [
    {
      song_name: "Gangsta's Paradise",
      artist_name: 'Coolio',
      song_url: 'media/Gangsta\'s Paradise.mp3',
      caratula: 'media/gangsta\'s.jpg'
    },
    {
      song_name: 'Eres Mía',
      artist_name: 'Romeo Santos',
      song_url: 'media/Romeo Santos - Eres Mía.mp3',
      caratula: 'media/ab67706c0000da84008711051208af0862d31595.jpg'
    },
    {
      song_name: 'Oh Lord',
      artist_name: 'Foxy Shazam',
      song_url: 'media/Oh Lord - Foxy Shazam.mp3',
      caratula: 'media/1-2889d68a.png'
    },
    {
      song_name: 'I Gotta Feeling',
      artist_name: 'Black Eyed Peas',
      song_url: 'media/Black Eyed Peas - I Gotta Feeling (Audio).mp3',
      caratula: 'media/gotta.jpg'
    },
    {
      song_name: 'Thrift Shop',
      artist_name: 'Macklemore & Ryan Lewis',
      song_url: 'media/MACKLEMORE & RYAN LEWIS - THRIFT SHOP FEAT. WANZ (OFFICIAL VIDEO).mp3',
      caratula: 'media/thrift.jpg'
    }
  ];

  constructor(
    private spotifyPlaylistService: SpotifyPlaylistService,
    private spotifyService: SpotifyService
  ) {
    this.setupAudioEvents();
    // Intentar cargar playlist de Spotify, si falla usar por defecto
    this.loadSpotifyPlaylist();
  }

  // Método auxiliar para obtener una canción local aleatoria
  private getRandomLocalSong(): string {
    const randomIndex = Math.floor(Math.random() * this.defaultSongs.length);
    return this.defaultSongs[randomIndex].song_url;
  }

  async loadSpotifyPlaylist() {
    try {
      // Obtener token de acceso válido (guardado o nuevo)
      const token = await this.spotifyService.getValidAccessToken();
      
      this.spotifyPlaylistService.getPlaylist(token).subscribe({
        next: (response: any) => {
          console.log('=== PLAYLIST DE SPOTIFY CARGADA ===');
          console.log('Nombre de playlist:', response.name);
          console.log('Total de tracks:', response.tracks?.items?.length || 0);
          console.log('Respuesta completa:', response);
          
          // Mapear TODAS las canciones de Spotify + combinar con locales
          if (response.tracks && response.tracks.items && response.tracks.items.length > 0) {
            console.log(` Procesando ${response.tracks.items.length} tracks de Spotify...`);
            
            // Separar canciones CON preview y SIN preview
            const songsWithPreview: Song[] = [];
            const songsWithoutPreview: Song[] = [];
            
            response.tracks.items
              .filter((item: any) => item.track)
              .forEach((item: any, index: number) => {
                const track = item.track;
                const hasPreview = track.preview_url && track.preview_url.trim() !== '';
                
                console.log(` Track ${index + 1}: ${track.name} - Preview: ${hasPreview ? 'SÍ ' : 'NO '}`);
                if (hasPreview) console.log(`    Preview URL: ${track.preview_url}`);
                
                const song: Song = {
                  song_name: track.name,
                  artist_name: track.artists && track.artists[0] ? track.artists[0].name : 'Artista desconocido',
                  song_url: hasPreview ? track.preview_url : '', // Solo usar preview si existe
                  caratula: track.album && track.album.images && track.album.images[0] 
                    ? track.album.images[0].url 
                    : 'https://via.placeholder.com/300x300/1DB954/ffffff?text=' + encodeURIComponent(track.name)
                };
                
                if (hasPreview) {
                  songsWithPreview.push(song);
                } else {
                  songsWithoutPreview.push(song);
                }
              });
            
            console.log(` Canciones CON preview: ${songsWithPreview.length}`);
            console.log(`Canciones SIN preview: ${songsWithoutPreview.length}`);
            
            // Usar solo canciones con preview + algunas locales como backup
            const finalPlaylist = [...songsWithPreview, ...this.defaultSongs.slice(0, 3)];
            
            console.log(` Total de canciones: ${finalPlaylist.length}`);
            console.log(` Spotify (con preview): ${songsWithPreview.length}, Locales backup: ${Math.min(3, this.defaultSongs.length)}`);
            
            if (finalPlaylist.length > 0) {
              // Usar la playlist final
              this._playlist.set(finalPlaylist);
              this.loadSong(finalPlaylist[0]);
              this._currentIndex.set(0);
              console.log(' Playlist con previews de Spotify cargada y lista para reproducir');
            } else {
              console.warn(' No se encontraron previews, usando solo playlist local');
              this.loadDefaultPlaylist();
            }
          } else {
            console.warn(' No se encontraron tracks, usando playlist local');
            this.loadDefaultPlaylist();
          }
        },
        error: (error) => {
          console.error(' Error cargando playlist de Spotify:', error);
          this.loadDefaultPlaylist();
        }
      });
    } catch (error) {
      console.error('Error obteniendo token de Spotify:', error);
      this.loadDefaultPlaylist();
    }
  }

  private loadDefaultPlaylist() {
    console.log('Cargando playlist por defecto');
    this._playlist.set(this.defaultSongs);
    
    if (this.defaultSongs.length > 0) {
      this.loadSong(this.defaultSongs[0]);
      this._currentIndex.set(0);
    }
  }

  private setupAudioEvents() {
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

    // Event listener ÚNICO para cuando termina la canción
    this._audio.addEventListener('ended', () => {
      console.log('🎵 Canción terminada - Pasando a la siguiente automáticamente');
      // Pequeño delay para evitar problemas y asegurar que termine limpiamente
      setTimeout(() => {
        console.log('⏭ Ejecutando nextSong()...');
        this.nextSong();
      }, 100);
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
    console.log('=== Cargando canción ===');
    console.log('Nombre:', song.song_name);
    console.log('Artista:', song.artist_name);
    console.log('URL:', song.song_url);
    
    // Determinar tipo de audio
    const isSpotifyPreview = song.song_url.includes('scdn.co') || song.song_url.includes('spotify');
    const isLocalFile = song.song_url.startsWith('media/');
    
    if (isSpotifyPreview) {
      console.log(' TIPO: Preview de Spotify (30 segundos)');
    } else if (isLocalFile) {
      console.log(' TIPO: Archivo local');
    } else {
      console.log(' TIPO: Desconocido');
    }
    
    console.log('Auto reproducir:', autoPlay);
    
    // Pausar audio actual si está reproduciéndose
    if (!this._audio.paused) {
      this._audio.pause();
    }
    
    // Actualizar estado
    this._currentSong.set(song);
    this._isPlaying.set(false);
    
    // Crear nuevo elemento audio para evitar problemas de caché
    this._audio.src = '';
    this._audio.load();
    
    // Configurar nueva fuente
    this._audio.src = song.song_url;
    this._audio.load();
    
    // Event listeners para esta canción específica
    const onLoadedMetadata = () => {
      this._duration.set(this._audio.duration);
      console.log('Duración cargada:', this._audio.duration);
      this._audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
    
    const onCanPlay = () => {
      console.log('Audio listo para reproducir');
      if (autoPlay) {
        this._audio.play().then(() => {
          console.log('Reproducción iniciada exitosamente');
        }).catch(e => {
          console.error('Error reproduciendo audio:', e);
        });
      }
      this._audio.removeEventListener('canplay', onCanPlay);
    };
    
    const onError = (e: any) => {
      console.error('=== ERROR CARGANDO AUDIO ===');
      console.error('URL problemática:', song.song_url);
      console.error('Error details:', e);
      console.error('Audio error code:', this._audio.error?.code);
      console.error('Audio error message:', this._audio.error?.message);
      this._audio.removeEventListener('error', onError);
    };
    
    this._audio.addEventListener('loadedmetadata', onLoadedMetadata);
    this._audio.addEventListener('canplay', onCanPlay);
    this._audio.addEventListener('error', onError);
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
    console.log('=== SELECCIÓN MANUAL ===');
    console.log('Canción seleccionada:', song.song_name);
    
    // Encontrar el índice de la canción seleccionada
    const playlist = this._playlist();
    const songIndex = playlist.findIndex(s => 
      s.song_name === song.song_name && s.artist_name === song.artist_name
    );
    
    if (songIndex !== -1) {
      console.log('Índice encontrado:', songIndex);
      this._currentIndex.set(songIndex);
      this.loadSong(song, true);
    } else {
      console.warn('Canción no encontrada en la playlist');
      this.loadSong(song, true);
    }
  }

  nextSong() {
    const playlist = this._playlist();
    if (playlist.length === 0) {
      console.warn('No hay canciones en la playlist');
      return;
    }
    
    const currentIndex = this._currentIndex();
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    
    console.log(`=== SIGUIENTE CANCIÓN ===`);
    console.log(`Índice actual: ${currentIndex}`);
    console.log(`Próximo índice: ${nextIndex}`);
    console.log(`Próxima canción: ${nextSong.song_name}`);
    
    this._currentIndex.set(nextIndex);
    this.loadSong(nextSong, true);
  }

  previousSong() {
    const playlist = this._playlist();
    if (playlist.length === 0) {
      console.warn('No hay canciones en la playlist');
      return;
    }
    
    const currentIndex = this._currentIndex();
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevSong = playlist[prevIndex];
    
    console.log(`=== CANCIÓN ANTERIOR ===`);
    console.log(`Índice actual: ${currentIndex}`);
    console.log(`Índice anterior: ${prevIndex}`);
    console.log(`Canción anterior: ${prevSong.song_name}`);
    
    this._currentIndex.set(prevIndex);
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
    return [...this._playlist()];
  }
  
  // Método de prueba para diagnosticar problemas
  testAudio() {
    console.log(' DIAGNÓSTICO DE AUDIO');
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
      console.log(' Audio de prueba listo');
      this._audio.play().then(() => {
        console.log(' Audio de prueba reproduciendo');
      }).catch(error => {
        console.log(' Error reproduciendo audio de prueba:', error);
      });
    }, { once: true });
  }
}