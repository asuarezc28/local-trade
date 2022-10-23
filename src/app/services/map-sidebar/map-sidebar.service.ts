import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Search } from 'src/app/+modules/local-product/models/search';

@Injectable({
  providedIn: 'root'
})
export class MapSidebarService {

  changeLayerMap$ = new EventEmitter<string>();

  idItemToMap$ = new EventEmitter<number>();

  private dataToLocalProductLayer = new BehaviorSubject<any>([]);
  dataToLocalProductLayer$ = this.dataToLocalProductLayer.asObservable();

  private changeLayerOnMap = new BehaviorSubject<string>('local');
  changeLayerOnMap$ = this.changeLayerOnMap.asObservable();

  private filtersToMapChanges = new BehaviorSubject<Search>(null);
  filtersToMapChanges$ = this.filtersToMapChanges.asObservable();

  private orderByLocation = new Subject();
  orderByLocationChanges$ = this.orderByLocation.asObservable();


  private filtersToMapChangesWalking = new BehaviorSubject<string[]>([]);
  filtersToMapChangesWalking$ = this.filtersToMapChangesWalking.asObservable();

  private formDetailPage = new BehaviorSubject<boolean>(false);
  formDetailPage$ = this.formDetailPage.asObservable();

  private requiredUserLocation = new Subject<boolean>();
  requiredUserLocation$ = this.requiredUserLocation.asObservable();


  private isLoadingLogo = new Subject<boolean>();
  isLoadingLogo$ = this.isLoadingLogo.asObservable();

  constructor() { }

  filtersToMap(data): void {
    this.filtersToMapChanges.next(data);
  }

  orderDataByLocation(data): void {
    this.orderByLocation.next(data);
  }

  filtersToMapWalking(data): void {
    this.filtersToMapChangesWalking.next(data);
  }


  detailPage(data): void {
    this.formDetailPage.next(data);
  }

  changeLayer(data): void {
    this.changeLayerOnMap.next(data);
  }


  sendDataFromMap(data): void {
    this.dataToLocalProductLayer.next(data);
  }

  requestUserLocation(data): void {
    this.requiredUserLocation.next(data);
  }

  startIsLoadingLogo(data): void {
    this.isLoadingLogo.next(data);
  }
}



