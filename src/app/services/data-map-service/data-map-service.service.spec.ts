import { TestBed } from '@angular/core/testing';

import { DataMapServiceService } from './data-map-service.service';

describe('DataMapServiceService', () => {
  let service: DataMapServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataMapServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
