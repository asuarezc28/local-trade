import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorInfoToSearchService {

  private dataInfoToSearch = new BehaviorSubject<string[]>([]);
  dataInfoToSearch$ = this.dataInfoToSearch.asObservable();

  private handlePage = new BehaviorSubject<boolean>(false);
  handlePage$ = this.handlePage.asObservable();

  isHandle$ = new EventEmitter<boolean>(true);

  constructor() { }


  infoToLocalProduct(data){
    this.dataInfoToSearch.next(data);
  }

  isHandlePage(data){
    this.handlePage.next(data);
  }

}
