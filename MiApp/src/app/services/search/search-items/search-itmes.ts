import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../spotify.service';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-search-items',
  standalone: false,
  templateUrl: './search-items.html',
  styleUrl: './search-items.css',
  
  
})


export class SearchItems implements OnInit {

  searchItems$!: Observable<any>;
  searchQuery: string = '';

  constructor(
    private spotifyService: SpotifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.searchItems$ = this.route.queryParams.pipe(
      switchMap(params => {
        this.searchQuery = params['q'] || 'Artic';
        console.log(' Buscando:', this.searchQuery);
        
        // Convertir Promise a Observable y manejar errores
        return from(this.spotifyService.searchTracks(this.searchQuery)).pipe(
          switchMap(tracks => {
            // Crear estructura compatible con el template
            const result = { 
              tracks: tracks || [], 
              albums: [], 
              artists: [] 
            };
            return from([result]);
          }),
          catchError(error => {
            console.error(' Error en búsqueda:', error);
            // Retornar estructura vacía en caso de error
            return from([{ tracks: [], albums: [], artists: [] }]);
          })
        );
      })
    );

    
    this.searchItems$.subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos:', data);
        console.log('Albums:', data.albums);
        console.log('Artists:', data.artists);
        console.log('Tracks:', data.tracks);
      },
      error: (err) => {
        console.error('❌ Error:', err);
      }
    });
  }
}
