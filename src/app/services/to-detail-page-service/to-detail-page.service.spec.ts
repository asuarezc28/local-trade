import { TestBed } from '@angular/core/testing';

import { ToDetailPageService } from './to-detail-page.service';

describe('ToDetailPageService', () => {
  let service: ToDetailPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToDetailPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
