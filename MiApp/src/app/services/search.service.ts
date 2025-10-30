import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _searchResults = signal<any[]>([]);
  
  // Getter para obtener los resultados de búsqueda
  get searchResults() {
    return this._searchResults;
  }

  // Método para establecer resultados de búsqueda
  setSearchResults(results: any[]): void {
    this._searchResults.set(results);
  }

  // Método para limpiar resultados
  clearResults(): void {
    this._searchResults.set([]);
  }
}