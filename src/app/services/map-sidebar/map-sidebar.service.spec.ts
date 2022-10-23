import { TestBed } from '@angular/core/testing';

import { MapSidebarService } from './map-sidebar.service';

describe('MapSidebarService', () => {
  let service: MapSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
