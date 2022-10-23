import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPhotoGalleryComponent } from './dialog-photo-gallery.component';

describe('DialogPhotoGalleryComponent', () => {
  let component: DialogPhotoGalleryComponent;
  let fixture: ComponentFixture<DialogPhotoGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPhotoGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPhotoGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
