import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs'
import { SidebarMenuService } from './services/sidebar-menu-service/sidebar-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  mediaSub: Subscription;
  deviceXs: boolean;
  constructor(public mediaObserver: MediaObserver,
    private SidebarService: SidebarMenuService
  ) {

  }

  ngOnInit(): any {
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      console.log(result.mqAlias);
      this.deviceXs = result.mqAlias === 'xs' ? true : false;
      if (this.deviceXs) {
        this.SidebarService.sidebarChange(true);
      }
    }
    );
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }


}
