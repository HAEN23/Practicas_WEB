import { booleanAttribute, Component, input, OnInit } from '@angular/core';
import { Song } from '../app/models/song.model';

@Component({
  selector: 'app-song-info',
  standalone: false,
  templateUrl: './song-info.html',
  styleUrl: './song-info.css',
  host:{
    '[class]': 'displayMode()',
  }
})
export class SongInfo{
  display_mode = input.required<string>({ alias: 'displayMode'});
  song = input.required<Song>();

  displayMode(){
    return this.display_mode();
  }
}
