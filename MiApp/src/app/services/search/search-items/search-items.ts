import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-search-items',
  standalone: false,
  templateUrl: './search-items.html',
  styleUrl: './search-items.css'
})
export class SearchItems implements OnInit {
  private spotifyService = inject(SpotifyService);
  private route = inject(ActivatedRoute);

  searchResults: any = null;
  searchQuery: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.performSearch();
      }
    });
  }

  private async performSearch(): Promise<void> {
    this.isLoading = true;
    try {
      console.log('🔍 Buscando:', this.searchQuery);
      
      // Realizar búsqueda usando el SpotifyService existente
      const tracks = await this.spotifyService.searchTracks(this.searchQuery);
      
      // Simular estructura de respuesta completa de Spotify
      this.searchResults = {
        tracks: { items: tracks || [] },
        albums: { items: [] }, // Por ahora vacío, se puede implementar después
        artists: { items: [] } // Por ahora vacío, se puede implementar después
      };
      
      console.log('✅ Resultados encontrados:', this.searchResults);
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      this.searchResults = {
        tracks: { items: [] },
        albums: { items: [] },
        artists: { items: [] }
      };
    } finally {
      this.isLoading = false;
    }
  }
}