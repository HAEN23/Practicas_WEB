import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { SearchView } from './search-view/search-view';
import { PlaylistView } from './playlist-view/playlist-view';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'search', component: SearchView },
  { path: 'playlist', component: PlaylistView },
  { path: '**', redirectTo: '/home' } // Ruta comodín para páginas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
