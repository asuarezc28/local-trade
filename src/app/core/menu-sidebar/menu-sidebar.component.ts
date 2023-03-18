import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, NavigationStart } from '@angular/router';
import { SidebarMenuService } from '../../services/sidebar-menu-service/sidebar-menu.service'
import { Link } from '../models/link.model';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as Globals from '../../../app/shared/global';
import { MapSidebarService } from 'src/app/services/map-sidebar/map-sidebar.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.css']
})
export class MenuSidebarComponent implements OnInit {

  show: boolean = false;
  links: Link[] = [];
  changeRoute: boolean = false;
  includesDetailLocalP: boolean = false;

  constructor(private SidebarService: SidebarMenuService,
    private router: Router, private activateRoute: ActivatedRoute) {

    //   router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // )
    //   .subscribe(event => {
    //     switch (event[Globals.URL]) {
    //       case Globals.LOCALPRODUCTDETAILURL:
    //         this.includesDetailLocalP = true;
    //         break;
    //       default:
    //         this.includesDetailLocalP = false;
    //     }
    //   });

    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationStart) {
    //     this.changeRoute = true;
    //   } else {
    //     this.changeRoute = false;
    //   }
    //   if (event instanceof NavigationStart) {

    //   };
    // });

  }

  ngOnInit(): void {
    this.SidebarService.sidebarView$.subscribe(changeShow => {
      if (!this.show) {
        this.show = true;
      } else {
        this.show = changeShow;
      }
    });
  }

  openCloseSidebar(): void {
    this.SidebarService.sidebarChange(false);
  }


}

