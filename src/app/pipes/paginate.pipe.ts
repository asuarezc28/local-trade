import { Pipe, PipeTransform } from '@angular/core';
import { PaginatorInfoToSearchService } from '../services/paginator-info-to-search/paginator-info-to-search.service';

@Pipe({
  name: 'paginate'
})
export class PaginatePipe implements PipeTransform {
  count = 1;
  constructor(private paginatorInfoToSearchService: PaginatorInfoToSearchService) {

  }

  transform(array: any[], page_size: any | string, page_number: number): any[] {

    if (!array.length) return []

    if (page_size === 'all') {
      return array
    }

    page_size = page_size || 20
    page_number = page_number || 2
    --page_number

    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  }

}
