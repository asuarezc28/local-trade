
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuService {

  sidebarView = new Subject<boolean>();
  sidebarView$ = this.sidebarView.asObservable();
  constructor() { }
  //Change to Subject 
  //sidebarViewChange$ = new EventEmitter<boolean>();


  sidebarChange(show) {
    this.sidebarView.next(show); 
  }

}














