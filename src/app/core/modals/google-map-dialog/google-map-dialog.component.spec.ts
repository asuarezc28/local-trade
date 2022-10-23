import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapDialogComponent } from './google-map-dialog.component';

describe('GoogleMapDialogComponent', () => {
  let component: GoogleMapDialogComponent;
  let fixture: ComponentFixture<GoogleMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleMapDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
