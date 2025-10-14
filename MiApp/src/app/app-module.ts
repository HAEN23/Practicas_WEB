import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { InfoSong } from './info-song/info-song';
import { MediaControl } from './media-control/media-control';
import { AudioController } from './audio-controller/audio-controller';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
    InfoSong,
    MediaControl,
    AudioController
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
