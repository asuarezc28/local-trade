import { Component, OnInit } from '@angular/core';
import { SidebarMenuService } from 'src/app/services/sidebar-menu-service/sidebar-menu.service';

@Component({
  selector: 'app-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.css']
})
export class SidebarContentComponent implements OnInit {
  show: boolean = false;

  constructor(private SidebarService: SidebarMenuService) { }

  ngOnInit(): void {
  
    this.SidebarService.sidebarView$.subscribe(changeShow => {
      if (!this.show) {
        this.show = true;
      } else {
        this.show = changeShow;
      }
    });

  }
}
