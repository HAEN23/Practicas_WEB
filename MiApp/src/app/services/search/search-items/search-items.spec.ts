import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SpotifyService } from '../../spotify.service';

import { SearchItems } from './search-items';

describe('SearchItems', () => {
  let component: SearchItems;
  let fixture: ComponentFixture<SearchItems>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockSpotifyService: jasmine.SpyObj<SpotifyService>;

  beforeEach(async () => {
    // Crear mocks de los servicios
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['queryParams'], {
      queryParams: of({ q: 'test search' })
    });
    
    mockSpotifyService = jasmine.createSpyObj('SpotifyService', ['searchTracks']);
    mockSpotifyService.searchTracks.and.returnValue(Promise.resolve([
      { name: 'Test Song', artists: [{ name: 'Test Artist' }] }
    ]));

    await TestBed.configureTestingModule({
      declarations: [SearchItems],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SpotifyService, useValue: mockSpotifyService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search results', () => {
    expect(component.searchResults).toBeNull();
    expect(component.searchQuery).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  it('should perform search on initialization with query params', async () => {
    await fixture.whenStable();
    
    expect(component.searchQuery).toBe('test search');
    expect(mockSpotifyService.searchTracks).toHaveBeenCalledWith('test search');
  });
});
