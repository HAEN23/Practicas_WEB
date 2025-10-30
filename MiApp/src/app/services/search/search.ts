import { Component, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
  private router = inject(Router);
  private spotifyService = inject(SpotifyService);

  buscado: string = '';
  isSearching: boolean = false;

  @Output() closeSearch = new EventEmitter<void>();

  constructor() {}

  getBuscado(): string {
    return this.buscado;
  }

  async onSearch(): Promise<void> {
    const searchTerm = this.buscado.trim();
    
    if (!searchTerm) {
      return;
    }

    this.isSearching = true;

    try {
      // Realizar búsqueda con Spotify API
      const results = await this.spotifyService.searchTracks(searchTerm);
      console.log('Resultados de búsqueda:', results);
      
      // Navegar a la página de resultados con los parámetros
      this.router.navigate(['/search'], { 
        queryParams: { 
          q: searchTerm,
          results: JSON.stringify(results.slice(0, 10)) // Limitar a 10 resultados
        } 
      });
    } catch (error) {
      console.error(' Error en búsqueda:', error);
      // Navegar sin resultados en caso de error
      this.router.navigate(['/search'], { 
        queryParams: { q: searchTerm } 
      });
    } finally {
      this.isSearching = false;
    }
  }

  // Método para limpiar la búsqueda
  clearSearch(): void {
    this.buscado = '';
    this.isSearching = false;
  }

  // Método para navegación a home
  goHome(): void {
    this.router.navigate(['/']);
  }

  // Método para navegación a playlist
  goToPlaylist(): void {
    this.router.navigate(['/playlist']);
  }

  // Método para cerrar la barra de búsqueda
  closeSearchBar(): void {
    this.clearSearch();
    this.closeSearch.emit();
  }
}
