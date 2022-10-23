import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalProductListComponent } from './local-product-list.component';

describe('LocalProductListComponent', () => {
  let component: LocalProductListComponent;
  let fixture: ComponentFixture<LocalProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalProductListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
