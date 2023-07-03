import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private locationSubject = new BehaviorSubject<any>(null);
  private intersectSubject = new BehaviorSubject<boolean>(false);

  setLocation(location: any) {
    this.locationSubject.next(location);
  }

  getIntersect(intersect) {
    // Realizar cálculo del intersect...
    console.log('DAME INTE', intersect);
    this.intersectSubject.next(intersect);
  }

  getLocationObservable() {
    return this.locationSubject.asObservable();
  }

  getIntersectObservable() {
    return this.intersectSubject.asObservable();
  }
}
