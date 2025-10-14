import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongInfo } from './song-info';

describe('SongInfo', () => {
  let component: SongInfo;
  let fixture: ComponentFixture<SongInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SongInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
