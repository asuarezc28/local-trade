import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, NavigationStart, NavigationError } from '@angular/router';
import { AppUrls } from 'src/app/config/app-urls.config';
import { SidebarMenuService } from '../../services/sidebar-menu-service/sidebar-menu.service'
import { Link } from '../models/link.model';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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
    private router: Router, private activateRoute: ActivatedRoute,
    private MapSidebarService: MapSidebarService) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        switch (event['url']) {
          case '/local-product/detail':
            this.includesDetailLocalP = true;
            break;
          default:
            this.includesDetailLocalP = false;
        }
      });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.changeRoute = true;
      } else {
        this.changeRoute = false;
      }
      if (event instanceof NavigationStart) {

      };
    });
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

  goToLocal() {
    if (!this.includesDetailLocalP) {
      this.router.navigate([AppUrls.AppLocalProductList]);
    }
    const layer = 'local';
    this.sendInfo(layer);
  }



  sendInfo(layer) {
    if (this.changeRoute) {
      this.SidebarService.sidebarChange(true);
      this.MapSidebarService.changeLayer(layer);
    }
    else {
      this.SidebarService.sidebarChange(false);
    }
  }
}
