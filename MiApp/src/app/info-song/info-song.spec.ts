import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSong } from './info-song';

describe('InfoSong', () => {
  let component: InfoSong;
  let fixture: ComponentFixture<InfoSong>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoSong]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSong);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
