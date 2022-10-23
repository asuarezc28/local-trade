import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalProductDetailComponent } from './local-product-detail.component';

describe('LocalProductDetailComponent', () => {
  let component: LocalProductDetailComponent;
  let fixture: ComponentFixture<LocalProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalProductDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
