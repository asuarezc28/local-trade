import { TestBed } from '@angular/core/testing';

import { PaginatorInfoToSearchService } from './paginator-info-to-search.service';

describe('PaginatorInfoToSearchService', () => {
  let service: PaginatorInfoToSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatorInfoToSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
