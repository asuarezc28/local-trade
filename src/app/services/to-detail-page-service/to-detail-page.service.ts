import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToDetailPageService {

  public shopToDetailPage = new BehaviorSubject<string[]>([]);
  shopToDetailPage$ = this.shopToDetailPage.asObservable();

  constructor() { }
}
