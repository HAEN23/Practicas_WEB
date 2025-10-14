import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioController } from './audio-controller.js';

describe('AudioController', () => {
  let component: AudioController;
  let fixture: ComponentFixture<AudioController>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioController]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
