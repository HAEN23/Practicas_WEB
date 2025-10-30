import { Component, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { SpotifyService } from '../../app/services/spotify.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  @ViewChild('searchContainer', { static: true }) searchContainer!: ElementRef;
  
  searchQuery: string = '';
  isLoading: boolean = false;
  @Output() searchResults = new EventEmitter<any[]>();
  
  private searchSubject = new Subject<string>();

  constructor(private spotifyService: SpotifyService) {
    // Búsqueda con debounce para mejor rendimiento
    this.searchSubject.pipe(
      debounceTime(300) // Esperar 300ms después de que el usuario deje de escribir
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  async doSearch(): Promise<void> {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery.trim());
    } else {
      this.clearSearch();
    }
  }

  async performSearch(query: string): Promise<void> {
    if (!query) {
      this.clearSearch();
      return;
    }

    this.setLoadingState(true);
    
    try {
      console.log('🔍 Buscando:', query);
      const results = await this.spotifyService.searchTracks(query);
      console.log('✅ Resultados encontrados:', results.length);
      
      this.searchResults.emit(results);
      this.setSuccessState();
      
      // Limpiar estado después de un momento
      setTimeout(() => this.clearStates(), 2000);
      
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      this.searchResults.emit([]);
      this.setErrorState();
      
      // Limpiar estado de error después de un momento
      setTimeout(() => this.clearStates(), 2000);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.doSearch();
    }
  }

  onInput(): void {
    // Búsqueda en tiempo real mientras escribes
    if (this.searchQuery.trim().length > 2) {
      this.searchSubject.next(this.searchQuery.trim());
    } else if (this.searchQuery.trim().length === 0) {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchResults.emit([]);
    this.clearStates();
  }

  private setLoadingState(loading: boolean): void {
    this.isLoading = loading;
    const container = this.searchContainer?.nativeElement;
    if (container) {
      container.classList.toggle('loading', loading);
      container.classList.remove('success', 'error');
    }
  }

  private setSuccessState(): void {
    this.isLoading = false;
    const container = this.searchContainer?.nativeElement;
    if (container) {
      container.classList.remove('loading', 'error');
      container.classList.add('success');
    }
  }

  private setErrorState(): void {
    this.isLoading = false;
    const container = this.searchContainer?.nativeElement;
    if (container) {
      container.classList.remove('loading', 'success');
      container.classList.add('error');
    }
  }

  private clearStates(): void {
    this.isLoading = false;
    const container = this.searchContainer?.nativeElement;
    if (container) {
      container.classList.remove('loading', 'success', 'error');
    }
  }
} 
