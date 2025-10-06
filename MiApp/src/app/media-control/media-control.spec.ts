import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaControl } from './media-control';

describe('MediaControl', () => {
  let component: MediaControl;
  let fixture: ComponentFixture<MediaControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
