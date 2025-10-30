import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { InfoSong } from './info-song/info-song';
import { MediaControl } from './media-control/media-control';
import { AudioController } from './audio-controller/audio-controller';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';

// Importar componentes de búsqueda
import { SearchBar } from '../search/search-bar/search-bar';
import { SearchSection } from '../search/search-bar/search-section/search-section';
import { Search } from './services/search/search';
import { SearchItems } from './services/search/search-items/search-items';
import { Player } from './player/player';
import { Home } from './home/home';
import { SearchView } from './search-view/search-view';
import { PlaylistView } from './playlist-view/playlist-view';

@NgModule({
  declarations: [
    App,
    InfoSong,
    MediaControl,
    AudioController,
    SearchBar,
    SearchSection,
    Search,
    SearchItems,
    Player,
    Home,
    SearchView,
    PlaylistView
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }
