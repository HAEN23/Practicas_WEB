import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { InfoSong } from './info-song/info-song';
import { MediaControl } from './media-control/media-control';

@NgModule({
  declarations: [
    App,
    InfoSong,
    MediaControl
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection()
  ],
  bootstrap: [App]
})
export class AppModule { }
